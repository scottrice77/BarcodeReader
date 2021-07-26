# BarcodeReader

This project contains an initial setup for the testing or use of the Barcode Recognition portion of the Shape Detection API implemented in modern mobile browsers. You can read more about it here https://wicg.github.io/shape-detection-api/ and find specifications on the Barcode Detector here https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector

**Please note, that the Barcode Detector is not implemented in desktop browsers. To use Barcode Detector will require a suitable mobile device. Browser support information can be found here** https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector#browser_compatibility

The BarcodeDetector is compatible with a range of barcode types including traditional, linear 1D types and more modern 2D types (like the now ubiquitous QRCode). In my experience it is highly performant; exceeding older Javascript libaries (like QuaggaJS) and modern commercial (highly expensive) libraries.

This project can be used in two ways. By downloading all files a quick start template is created. This serves as a quick introduction to device media and the barcode detector for users looking to build a quick and performant barcode reading app. This template includes a single HTML file, a single CSS file and the main Javascript file containing the practical barcode reader functionality.

As well as handling the initation of the Barcode Detector, the barcodes.js file includes implemented methods that capture live video from your device camera and features that can improve barcode reading peformance (creating buttons to zoom in and out and access the device torch where available). Access to zoom functionality and the device torch is, of course, subject to device compatibility but works with most modern phone handsets.

## index.html

A simple HTML page with three div elements. Two of these are supplied to barcodes.js during configuration as containers for the video camera feed and the control buttons. The final container is used by an embeded script to feedback the results of sucessfully scanned barcodes using the "setHandler" method and providing a function that accepts a single argument (the barcode scan result).

    BCReader.setHandler(function(result){
        let div=document.querySelector("#result");
        div.innerHTML+="<br>"+result;
    });

## style.css

Contains only two style classes for buttons called in the initialisation procedure in index.html. This CSS represents the default styling applied if users do not provide their own classes when starting the barcode reader.

## barcodes.js

The barcodes.js file adds a single object to the global name space (BCReader). This object contains all the properties and methods required to configure and manage a barcode reader application.

BCReader can be initialised with its setup function and providing an object with a number of (mostly) optional configuration options. As part of setup BCReader can create and embed a video element using your device camera as the source, add buttons to control your camera and device, configure the Barcode Reader API with the settings you specify or use predeterming defaults

### Step 1 - Initialisation ###

The initialisation call in the example index.html uses only a few basic properties. This is enough to create a working app.

    BCReader.setup(
        {
            container:'camera',
            buttons:'buttons',
            fit:true,
        }
    );

These settings supply container IDs for the video and buttons and instruct the video to resize to fit the container in which it is placed.

The full list of options is as follows

Property | Status | Description
---------|--------|------------
container|required|The ID of the HTML element in which the camera video should be embeded. If ommitted the camera is still initialised but not embeded within the document.
buttons|optional|The ID of the HTML element in which the controls should be embeded. If ommitted the buttons aren't created and the device will scan continously for barcodes (with the buttons scan mode can be toggled).
fit|optional|When supplied instructs the video to resize to the bounds of the container. Should only be used with fixed size elements.
formats|optional|An optional variable (must be an array if supplied) that lists the barcode formats to recognize. This should be used when you know the format of barcode(s) you will be scanning as limited supported options can improve performance and potentially reduce or eliminate false positive results.

## Using barcode.js as a module

# Barcode samples for testing

A range of barcode samples of the various types can be found here https://www.barcodefaq.com/
