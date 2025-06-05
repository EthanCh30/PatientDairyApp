<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Our Services - CaRe</title>
    <link rel="stylesheet" href="css/our_services.css">
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <?php include('header.html') ?>


    <main>
        <section class="overview">
            <h2>What We Offer</h2>
            <p>At CaRe, we provide a wide range of healthcare services designed to meet the diverse needs of our clients. Our services include primary care, mental health support, rehabilitation, and specialized treatments. We are committed to delivering high-quality care in a compassionate and supportive environment.</p>
            <img src="images\servicess.png" alt="Our Services">
        </section>

        <section class="patients">
            <h2>For Patients</h2>
            <p>Our services are designed to provide patients with the care and support they need, including:</p>
            <ul>
                <li><strong>Primary Care:</strong> Comprehensive medical care for everyday health issues, preventive care, and wellness checks.</li>
                <li><strong>Mental Health Support:</strong> Access to therapy, counseling, and mental health services to support emotional well-being.</li>
                <li><strong>Rehabilitation:</strong> Programs to aid recovery from injury or illness, including physical therapy and occupational therapy.</li>
                <li><strong>Specialized Treatments:</strong> Advanced treatments and interventions for specific health conditions, including chronic disease management.</li>
                <li><strong>Home Healthcare:</strong> In-home services to provide care and support in the comfort of your own home.</li>
            </ul>
        </section>

        <section class="providers">
            <h2>For Healthcare Providers</h2>
            <p>Our services also offer opportunities for healthcare professionals, including:</p>
            <ul>
                <li><strong>Professional Development:</strong> Access to training, workshops, and resources to enhance skills and stay current in the field.</li>
                <li><strong>Collaborative Care:</strong> Work alongside a multidisciplinary team to provide comprehensive care to clients.</li>
                <li><strong>Research Opportunities:</strong> Engage in research and contribute to advancements in healthcare practices and treatments.</li>
                <li><strong>Supportive Environment:</strong> Benefit from a supportive work environment with access to resources and a focus on professional well-being.</li>
                <li><strong>Flexible Scheduling:</strong> Opportunities for flexible work schedules to balance professional and personal commitments.</li>
            </ul>
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