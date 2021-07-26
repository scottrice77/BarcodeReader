# BarcodeReader

This project contains an initial setup for the testing or use of the Barcode Recognition portion of the Shape Detection API implemented in modern mobile browsers. You can read more about it here https://wicg.github.io/shape-detection-api/ and find specifications on the Barcode Detector here https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector

**Please note, that the Barcode Detector is not implemented in desktop browsers. To use Barcode Detector will require a suitable mobile device. Browser support information can be found here** https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector#browser_compatibility

The BarcodeDetector is compatible with a range of barcode types including traditional, linear 1D types and more modern 2D types (like the now ubiquitous QRCode). In my experience it is highly performant; exceeding older Javascript libaries (like QuaggaJS) and modern commercial (highly expensive) libraries.

This project can be used in two ways. By downloading all files a quick start template is created. This serves as a quick introduction to device media and the barcode detector for users looking to build a quick and performant barcode reading app. This template includes a single HTML file, a single CSS file and the main Javascript file containing the practical barcode reader functionality.

As well as handling the initation of the Barcode Detector, the barcodes.js file includes implemented methods that capture live video from your device camera and features that can improve barcode reading peformance (creating buttons to zoom in and out and access the device torch where available). Access to zoom functionality and the device torch is, of course, subject to device compatibility but works with most modern phone handsets.

## index.html

A simple HTML page with three div elements. Two of these are supplied to barcodes.js during configuration as containers for the video camera feed and the control buttons. The final container is used by an embeded script to feedback the results of sucessfully scanned barcodes.

## style.css

Contains only two style classes for buttons called in the initialisation procedure in index.html. This CSS represents the default styling applied if users do not provide their own classes when starting the barcode reader.

## barcodes.js



## Using barcode.js as a module

# Barcode samples for testing

A range of barcode samples of the various types can be found here https://www.barcodefaq.com/
