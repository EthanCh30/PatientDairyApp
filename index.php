<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CaRe</title>
    <link rel="stylesheet" href="css/main.css">
</head>

<body>
    <?php include('header.html') ?>
    <main>
        <video autoplay id="promotional-video" muted loop>
            <source src="images/promotional_video.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>

        <div class="description">
            <h2>Your mental heath matters!</h2>
            <br>
            <p>CaRe is here to support all your needs.</p>
            <P>Seek mental health information or support from qualified therapist.</P>
        </div>

        <div class="section" id="what-we-do">
            <h2>What We Do</h2>
            <p>Whether you prefer 1-to-1 sessions or group sessions, we are here to help!</p>
            <p><a href="our_services.php" class="btn" id="ourservicesbtn">Our Services</a></p>
        </div>

        <!-- Meet the team section -->
        <div class="section" id="meet-the-team">
            <h2>Meet the Team</h2>
            <p>Our team of qualified therapists is here to support you every step of the way.</p>
            <p><a href="about_us.php" class="btn" id="aboutusbtn">Learn More</a></p>
        </div>
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