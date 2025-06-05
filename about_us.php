<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - CaRe</title>
    <link rel="stylesheet" href="css/about_us.css">
</head>

<body>
    <?php include('header.html') ?>
    <main>
        <section class="intro">
            <h2>Welcome to CaRe</h2>
            <p>At CaRe, we are dedicated to offering compassionate, individualized care that empowers you to thrive. Our experienced team of healthcare professionals is committed to enhancing your well-being through a wide range of holistic services designed to nurture your mental, emotional, and physical health.</p>
            <img src="images\aboutuss.jpg" alt="About Us">
        </section>

        <section class="mission">
            <h2>Our Mission</h2>
            <p>We strive to provide exceptional, evidence-based care that fosters personal growth and mental resilience. At CaRe, we believe in a holistic, client-centered approach to mental health, where every individual is supported in achieving balance and fulfillment in their lives.</p>
        </section>

        <h2>Meet Our Team</h2>
        <section class="team">
            <div class="team-member">
                <img src="images\Sarah.jpg" alt="Dr. Sarah Thomson">
                <h3>Dr. Sarah Thomson</h3>
                <p>Clinical Psychologist</p>
                <p>With over 15 years of experience, Dr. Thomson is a specialist in cognitive behavioral therapy (CBT). She is passionate about helping individuals overcome anxiety, depression, and trauma through a personalized therapeutic approach.</p>
            </div>
            <div class="team-member">
                <img src="images\team2.jpg" alt="Dr. James">
                <h3>Dr. James</h3>
                <p>General Practitioner</p>
                <p>Dr. Doe is a compassionate medical practitioner with expertise in preventive care and holistic wellness. His patient-centered philosophy ensures that each individual receives the right care and guidance on their path to optimal health.</p>
            </div>
            <div class="team-member">
                <img src="images\Mel.jpg" alt="Mel">
                <h3>Sarah Lee</h3>
                <p>Licensed Social Worker</p>
                <p>Sarah is dedicated to providing emotional and social support to clients through counseling, advocacy, and community engagement. Her approach focuses on empowering individuals to navigate life's challenges with confidence and resilience.</p>
            </div>
        </section>
    </main>
    <?php include ('footer.html') ?>

    <div class="modal" id="loginModal">
        <div class="modal-content" id="loginContainer">
            <!-- Login form will be loaded here -->
        </div>
    </div>

    <script src="js/login.js"></script>
</body>

</html>