<?php

	$name = @trim(stripslashes($_POST['name']));
	$email = @trim(stripslashes($_POST['email']));
	$subject = @trim(stripslashes($_POST['subject']));
	$message = @trim(stripslashes($_POST['message']));

	$email_from = $email;
	$email_to = 'jobs@noxor.io';

	$body = 'Name: ' . $name . "\n\n" . 'Email: ' . $email . "\n\n" . 'Subject: ' . $subject . "\n\n" . 'Message: ' . $message;

	$success = mail($email_to, $body, 'Name: ' . $name . "\n\n" . 'Email: ' . $email . "\n\n" . 'Subject: ' . $subject . "\n\n" . 'Message: ' . $message);

?>

<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<script>alert("Thanks for reaching out!");</script>
	<!-- <meta HTTP-EQUIV="REFRESH" content="0; url=http://noxor.io"> -->
</head>
