<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$honeypot = trim($_POST['company_website'] ?? '');
if ($honeypot !== '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam detected.']);
    exit;
}

$formStart = (int)($_POST['form_start'] ?? 0);
if ($formStart <= 0 || (time() - $formStart) < 3) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Form submission too fast.']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

$errors = [];

if ($name === '' || mb_strlen($name) < 2 || mb_strlen($name) > 100) {
    $errors[] = 'Please enter a valid name.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (!preg_match('/^[0-9+()\-\s]{8,20}$/', $phone)) {
    $errors[] = 'Please enter a valid phone number.';
}

if ($message === '' || mb_strlen($message) < 15 || mb_strlen($message) > 2000) {
    $errors[] = 'Please enter a message between 15 and 2000 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

$to = 'hello@nmfinance.com';
$subject = 'New NM Finance Enquiry';
$body = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\n\nMessage:\n{$message}\n";
$headers = [
    'From: NM Finance Website <no-reply@nmfinance.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to send email right now. Please call us directly.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Thanks! Your enquiry has been sent successfully.']);
