<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - CaRe</title>
    <link rel="stylesheet" href="css/contact_us.css">
</head>

<body>
    <?php include('header.html') ?>

    <main>
        <section class="contact-info">
            <h2>Get in Touch</h2>
            <p>If you have any questions, concerns, or would like more information about our services, please don't hesitate to contact us. Our team is here to assist you with all your healthcare needs.</p>
            <p><strong>Phone:</strong> +123 456 7890</p>
            <p><strong>Email:</strong> info@carehealth.com</p>
            <p><strong>Address:</strong> 123 Health St., Wellness City, ST 12345</p>
        </section>
        <br>
        <section class="contact">
            <h2>Send Us a Message</h2>
            <form>
                <input type="text" name="name" placeholder="Your Name" required>
                <input type="email" name="email" placeholder="Your Email" required>
                <textarea name="message" rows="10" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </section>
    </main>

    <?php include('footer.html') ?>

    <div class="modal" id="loginModal">
        <div class="modal-content" id="loginContainer">
            <!-- Login form will be loaded here -->
        </div>
    </div>

    <script src="js/login.js"></script>
</body>

</html>