from pipes import quote

class MolnsLandingPage:
    def __init__(self, port):
        self.molns_landing_page = quote("""
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<HTML lang="en">
    <HEAD>
        <link href="bootstrap.css" rel="stylesheet">
        <TITLE>MOLNs</TITLE>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">
    </HEAD>

<BODY>
<CENTER>

<div class="container-fluid">
<div class="row-fluid">
    <div class="span12">

        <div class="well well-large">
            <H1>MOLNs</H1>
            <H2>A cloud computing appliance for spatial stochastic simulation of biochemical systems.</H2>
            <BR><BR>

            <!-- Welcome to the  Molns simulation appliance.-->
	    <a ID="ipython-link" class="btn btn-primary btn-large" href="https://0.0.0.0:{0}/" role="button">To the IPython Interface</a>
	<BR><BR>

<!--Please go <A ID="ipython-link" HREF="https://##HOSTNAME##/">Here</A> to access the iPython interface.-->
           <!-- StochSS is available <A HREF="https://##HOSTNAME##/">Here</A>.<BR> -->

     <p class="text-error"> Please note that due to the self-signed certification, you will see a warning before you can view the page.  Please accept the warning and proceed.</p>
        </div>
     </div>
</div>
<div class="row-fluid">
    <div class="span4">
    &nbsp;
    </div>
    <div class="span4">
    <p class="text-centered lead">
        <div id="registration_form" style="display: none">
        </div>
        <div id="registration_link" style="display: block">
        <p><a href="https://docs.google.com/forms/d/12tAH4f8CJ-3F-lK44Q9uQHFio_mGoK0oY829q5lD7i4/viewform" style="font-size: 20px;" target="_new"><B>Click here to Register MOLNs</B></a>
        <BR>
        MOLNs is open-source software, developed as part of the <a href="http://www.stochss.org" target="_new">StochSS</a> project, and we are relying on continued funding for sustained development. Please consider registering to show your support.
        </p>
        </div>
    </p>
    </div>
</div>
<hr>
<div class="row-fluid">
    <div class="span4">
	<p class="text-centered lead">Write PyURDME models as sharable IPython notebooks</p>
	<img src="fig1.png" alt="">
        <a href="http://www.pyurdme.org">PyURDME API reference</a>

    </div>
    <div class="span4">
	<p class="text-centered lead">Advanced analysis with Python scientific libraries</p>
	<img src="fig2.svg" alt="">

    </div>
   <div class="span4">
	<p class="text-centered lead">Large scale computational experiments made easy</p>
        <img src="fig3.png" alt="">
    </div>
 </div>

<div class="row-fluid">
<div class="span12">
<hr>
<center>
<a href="https://github.com/MOLNs/"><h4>Visit MOLNs on GitHub</h4></a>
</center>
</div>
</div>


<!--<div id="demo">Nothing here</div>-->


</CENTER>

<div id="demo"></div>


""".format(port))
