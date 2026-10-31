<?php
/**
 * Formulario de contacto de Revolution Digital
 * Recibe el formulario de /contacto/ y lo envía por correo desde tu propio hosting.
 *
 * Seguridad:
 *  - Solo acepta POST desde tu propio dominio (Origin / Referer).
 *  - Campo trampa (honeypot) y tiempo mínimo de llenado contra bots.
 *  - Límite de 5 envíos por hora por IP.
 *  - Validación y limpieza de todos los campos; sin inyección de cabeceras.
 */

/* ======================= CONFIGURACIÓN ======================= */
const MAIL_TO      = 'contact@revolutiondigital.pe';   // a dónde llegan los mensajes
const MAIL_FROM    = 'no-reply@revolutiondigital.agency';  // debe ser una cuenta de TU dominio (créala en cPanel)
const SITE_HOSTS   = ['revolutiondigital.agency', 'www.revolutiondigital.agency', 'web.revolutiondigital.agency', 'localhost', '127.0.0.1'];
const MAX_PER_HOUR = 5;
const MIN_SECONDS  = 3;    // un humano tarda más de 3 s en llenar el formulario
/* ============================================================= */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function reply(int $code, array $body): void {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok' => false, 'error' => 'method']);
}

/* --- mismo origen --- */
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$host = strtolower((string) parse_url($origin, PHP_URL_HOST));
if ($host === '' || !in_array($host, SITE_HOSTS, true)) {
    reply(403, ['ok' => false, 'error' => 'origin']);
}

/* --- leer datos (JSON o formulario) --- */
$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode($raw ?: '', true);
if (!is_array($data)) $data = $_POST;

$field = static function (string $k, int $max) use ($data): string {
    $v = isset($data[$k]) && is_string($data[$k]) ? $data[$k] : '';
    $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '');
    return mb_substr($v, 0, $max);
};

/* --- anti-bots --- */
if ($field('website', 200) !== '') reply(200, ['ok' => true]);           // honeypot: fingimos éxito
$ts = (int) ($data['ts'] ?? 0);
if ($ts > 0 && (time() * 1000 - $ts) < MIN_SECONDS * 1000) reply(429, ['ok' => false, 'error' => 'fast']);

/* --- límite por IP --- */
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$bucket = sys_get_temp_dir() . '/rd_contact_' . hash('sha256', $ip . __FILE__);
$now = time();
$hits = array_filter(array_map('intval', @file($bucket, FILE_IGNORE_NEW_LINES) ?: []), static fn($t) => $t > $now - 3600);
if (count($hits) >= MAX_PER_HOUR) reply(429, ['ok' => false, 'error' => 'rate']);

/* --- validación --- */
$name    = $field('nombre', 120);
$company = $field('empresa', 160);
$email   = $field('email', 160);
$phone   = $field('telefono', 40);
$service = $field('servicio', 80);
$budget  = $field('presupuesto', 80);
$message = $field('mensaje', 5000);
$lang    = in_array($field('lang', 2), ['es', 'en', 'it'], true) ? $field('lang', 2) : 'es';

$errors = [];
if (mb_strlen($name) < 2) $errors[] = 'nombre';
if (mb_strlen($company) < 2) $errors[] = 'empresa';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($phone !== '' && !preg_match('/^[0-9 +()\-]{6,40}$/', $phone)) $errors[] = 'telefono';
if (mb_strlen($message) < 10) $errors[] = 'mensaje';
if ($errors) reply(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]);

/* --- correo --- */
$oneLine = static fn(string $s): string => str_replace(["\r", "\n"], ' ', $s);
$subject = '=?UTF-8?B?' . base64_encode('Nuevo contacto web: ' . $oneLine($company) . ' (' . $oneLine($service ?: 'General') . ')') . '?=';
$body = "Nuevo mensaje desde el formulario de contacto\n"
      . "-------------------------------------------\n"
      . "Nombre:      {$name}\n"
      . "Empresa:     {$company}\n"
      . "Correo:      {$email}\n"
      . "Teléfono:    " . ($phone ?: '—') . "\n"
      . "Servicio:    " . ($service ?: '—') . "\n"
      . "Presupuesto: " . ($budget ?: '—') . "\n"
      . "Idioma:      {$lang}\n"
      . "IP:          {$ip}\n"
      . "Fecha:       " . date('Y-m-d H:i:s') . "\n\n"
      . "Mensaje:\n{$message}\n";

$headers = [
    'From: Revolution Digital <' . MAIL_FROM . '>',
    'Reply-To: ' . $oneLine($email),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: RD-Contact',
];

$sent = @mail(MAIL_TO, $subject, $body, implode("\r\n", $headers), '-f' . MAIL_FROM);
if (!$sent) reply(500, ['ok' => false, 'error' => 'mail']);

$hits[] = $now;
@file_put_contents($bucket, implode("\n", $hits), LOCK_EX);
reply(200, ['ok' => true]);
