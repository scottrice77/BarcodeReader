
let BCReader={
    foo:'Poo',
    status:{
        ready:false, //barcode reader ready
        scanning:false, //barcode reader active
    },
    //https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API (Available Formats)
    formats:['code_128','code_39','code_93','codabar','ean_13','ean_8','qr_code','upc_a','upc_e'],
    buttons:{
        scanbutton:true,
        scancontainer:null,
        torchbutton:true,
        torchcontainer:null,
        zoombutton:true,
        zoomcontainer:null,
        buttonstyle:null,
        buttononstyle:null
    },
    events:{//Functions to be added by users
        handler:null
    },
    video:null, //place holder the video element
    track:null, //place holder for the media track
    reader:null, //place holder for the barcode reader class instance
    
    //Buttong Functions
    buttonFunctions:{
        scanOn:function(){
            let ready=BCReader.status.ready;
            if(!ready){console.log('Barcode Reader or Camera not initialized on this device');return;}
            
            BCReader.status.scanning=true;//Accept scanned barcodes
            let sb=document.querySelector("#scanOn");
            let sb2=document.querySelector("#scanOff");
            sb.style.display='none';
            sb2.style.display='inline-block';
            //Go fullscreen and lock orientation
            if(!document.fullscreenElement){
                document.documentElement.requestFullscreen();
                window.screen.orientation.lock("portrait")
                .then(
                    success => {console.log(success)},
                    failure => {console.log(failure);document.exitFullscreen()}
                )
            }
        },
        scanOff:function(){
            let ready=BCReader.status.ready;
            if(!ready){console.log('Barcode Reader or Camera not initialized on this device');return;}
            
            BCReader.status.scanning=true;//Reject scanned barcodes
            let sb=document.querySelector("#scanOff");
            let sb2=document.querySelector("#scanOn");
            sb.style.display='none';
            sb2.style.display='inline-block';
        },
        zoomOut:function(){
            let track=BCReader.track;
            if(!track){console.log('No media track found');return;}
            let cap = track.getCapabilities();
            if(!cap.zoom){console.log('Can\'t zoom with this camera');return;}
            let settings=BCReader.track.getSettings();
            
            let lvl=Math.max(settings.zoom-cap.zoom.step,cap.zoom.min);
            BCReader.track.applyConstraints({ advanced: [{zoom: lvl}]});
        },
        zoomIn:function(){
            let track=BCReader.track;
            if(!track){console.log('No media track found');return;}
            let cap = track.getCapabilities();
            if(!cap.zoom){console.log('Can\'t zoom with this camera');return;}
            let settings=BCReader.track.getSettings();
            
            let lvl=Math.min(settings.zoom+cap.zoom.step,cap.zoom.max);
            BCReader.track.applyConstraints({ advanced: [{zoom: lvl}]});
        },
        torchOn:function(){
            let track=BCReader.track;
            if(!track){console.log('No media track found');return;}
            let cap = track.getCapabilities();
            if(!cap.torch){console.log('No Torch cababilitity on this device');return;}
            
            BCReader.track.applyConstraints({advanced: [{torch: true}]});
            let sb=document.querySelector("#torchOn");
            let sb2=document.querySelector("#torchOff");
            sb.style.display='none';
            sb2.style.display='inline-block';
        },
        torchOff:function(){
            let track=BCReader.track;
            if(!track){console.log('No media track found');return;}
            let cap = track.getCapabilities();
            if(!cap.torch){console.log('No Torch cababilitity on this device');return;}
            
            BCReader.track.applyConstraints({advanced: [{torch: false}]});
            let sb=document.querySelector("#torchOff");
            let sb2=document.querySelector("#torchOn");
            sb.style.display='none';
            sb2.style.display='inline-block';
        }
    },
    //Functions
    initCamera:async function(){
        const mediaStream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
        BCReader.track=mediaStream.getVideoTracks()[0];
        BCReader.video=document.createElement('video');
        let video=BCReader.video;
        video.srcObject = mediaStream;
        video.autoplay = true;
        video.width=window.innerWidth*0.965;//Default widths and heights
        video.height=window.innerHeight*0.75;
    },
    setup:function(config){
        //Initialize Settings
        BCReader.initCamera().then(function(){
            console.log(BCReader.track);
            console.log(BCReader.video);
            let bcrb=BCReader.buttons;
            //Apply config settings
            if(config.container){
                let cont=document.querySelector("#"+config.container);
                let video=BCReader.video;
                cont.innerHTML='';
                console.log(cont);
                cont.appendChild(video);
                if(config.fit){
                    video.width=cont.offsetWidth-2;
                    video.height=cont.offsetHeight-2;
                }
                if(config.width){video.width=config.width;}
                if(config.height){video.height=config.height;}
            }
            if(config.scanbutton===false){bcrb.scanbutton=false;}
            if(config.scancontainer){bcrb.scancontainer=config.scancontainer;}
            if(config.torchbutton===false){bcrb.torchbutton=false;}
            if(config.torchcontainer){bcrb.torchcontainer=config.torchcontainer;}
            if(config.zoombutton===false){bcrb.zoombutton=false;}
            if(config.zoomcontainer){bcrb.zoomcontainer=config.zoomcontainer;}
            if(config.buttonstyle){bcrb.buttonstyle=config.buttonstyle;}
            if(config.buttononstyle){bcrb.buttononstyle=config.buttononstyle;}
            
            //Initialize barcode reader - will fail in unsupported browsers
            try{
                BCReader.reader = new BarcodeDetector({
                  formats: BCReader.formats
                });
                //Only start the rendering process if everything initialises
                BCReader.status.ready=true;
                requestAnimationFrame(BCReader.detector);
            }catch(e){
                console.log(e);
            }
            
            //Generate default button classes if not provided by user
            if(!config.buttonstyle || !config.buttononstyle){BCReader.createStyles();}
            
            //Create requested buttons
            if(bcrb.zoombutton){
                let btndiv=(bcrb.zoomcontainer)?bcrb.scancontainer:(config.buttons)?config.buttons:false;
                if(btndiv){
                    btndiv=document.querySelector('#'+btndiv);
                    let btnClass=(bcrb.buttonstyle)?bcrb.buttonstyle:'default_btn_class';
                    let btn=document.createElement('div');
                    btn.onclick=BCReader.buttonFunctions.zoomOut;
                    btn.innerHTML='-';
                    btn.className=btnClass;
                    btndiv.appendChild(btn);
                    
                    //Disable button if no zoom capability
                    let track=BCReader.track;
                    let cap = track.getCapabilities();
                    if(!cap.zoom){btn.style="pointer-events: none;cursor: default;opacity: 0.6;";}
                }
            }
            if(bcrb.scanbutton){
                let btndiv=(bcrb.scancontainer)?bcrb.scancontainer:(config.buttons)?config.buttons:false;
                //Create button if a div is supplied
                if(btndiv){
                    let ready=BCReader.status.ready;//Disable buttons if not ready
                    
                    btndiv=document.querySelector('#'+btndiv);
                    let btnClass=(bcrb.buttonstyle)?bcrb.buttonstyle:'default_btn_class';
                    let btn=document.createElement('div');
                    btn.id="scanOn";
                    btn.onclick=BCReader.buttonFunctions.scanOn;
                    btn.innerHTML='Scan';
                    btn.className=btnClass;
                    btndiv.appendChild(btn);
                    if(!ready){btn.style="pointer-events: none;cursor: default;opacity: 0.6;";}
                    
                    //Off
                    btnClass=(bcrb.buttonstyle)?bcrb.buttonstyle:'defaultOn_btn_class';
                    btn=document.createElement('div');
                    btn.id="scanOff";
                    btn.onclick=BCReader.buttonFunctions.scanOff;
                    btn.innerHTML='Scan';
                    btn.className=btnClass;
                    btndiv.appendChild(btn);
                    if(!ready){btn.style="pointer-events: none;cursor: default;opacity: 0.6;";}
                }
            }
            if(bcrb.torchbutton){
                let btndiv=(bcrb.torchcontainer)?bcrb.torchcontainer:(config.buttons)?config.buttons:false;
                //Create button if a div is supplied
                if(btndiv){
                    let track=BCReader.track;
                    let cap = track.getCapabilities();
                    
            
                    btndiv=document.querySelector('#'+btndiv);
                    let btnClass=(bcrb.buttonstyle)?bcrb.buttonstyle:'default_btn_class';
                    let btn=document.createElement('div');
                    btn.id="torchOn";
                    btn.onclick=BCReader.buttonFunctions.torchOn;
                    btn.innerHTML='Torch';
                    btn.className=btnClass;
                    btndiv.appendChild(btn);
                    if(!cap.torch){btn.style="pointer-events: none;cursor: default;opacity: 0.6;";}
                    //Off
                    btnClass=(bcrb.buttonstyle)?bcrb.buttonstyle:'defaultOn_btn_class';
                    btn=document.createElement('div');
                    btn.id="torchOff";
                    btn.onclick=BCReader.buttonFunctions.torchOff;
                    btn.innerHTML='Torch';
                    btn.className=btnClass;
                    btndiv.appendChild(btn);
                    if(!cap.torch){btn.style="pointer-events: none;cursor: default;opacity: 0.6;";}
                }
            }
            if(bcrb.zoombutton){
                let btndiv=(bcrb.zoomcontainer)?bcrb.scancontainer:(config.buttons)?config.buttons:false;
                if(btndiv){
                    btndiv=document.querySelector('#'+btndiv);
                    let btnClass=(bcrb.buttonstyle)?bcrb.buttonstyle:'default_btn_class';
                    let btn=document.createElement('div');
                    btn.onclick=BCReader.buttonFunctions.zoomIn;
                    btn.innerHTML='+';
                    btn.className=btnClass;
                    btndiv.appendChild(btn);
                    
                    //Disable button if no zoom capability
                    let track=BCReader.track;
                    let cap = track.getCapabilities();
                    if(!cap.zoom){btn.style="pointer-events: none;cursor: default;opacity: 0.6;";}
                }
            }
            
            //Update amend required formats
            if(config.formats && Array.isArray(config.formats)){
                BCReader.formats=JSON.parse(JSON.stringify(config.formats));
            }
            //Continual Scanning on and/or no scan button
            if(config.alwayson || !BCReader.buttons.scanbutton){BCReader.status.scanning=true;}
            
            
        });
        
    },
    //Recursive call to process detection on animation frames
    detector:function(){
        let bco=BCReader;
        let bcr=BCReader.reader;
        let bcrb=BCReader.buttons;
        bcr.detect(video).then(function(res){
            if(res.length===0 || !bco.status.ready || !bco.status.scanning){return;}//Do not process any results unless scanning is turned on
            //HANDLE RECIEVING RESULT
            if(bco.events.handler){bco.events.handler(res);}
            //IF SCANNING IS NOT PERSISTENT, TURN OFF SCANNING AND RESET BUTTONS
            if(bcrb.scanbutton){
                bco.buttonFunctions.scanOff();
            }
        });
        //Call self
        requestAnimationFrame(BCReader.detector);
    },
    //Function to set the handler setting
    setHandler:function(e){
        if(typeof(e)==='function'){
            BCReader.events.handler=e;
        }
    },
    //Creates and appends default style
    createStyles:function(){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.default_btn_class { ';
        style.innerHTML +='border-radius:40px;';
        style.innerHTML +='border:2px solid #aaaa22;';
        style.innerHTML +='padding:8px 10px 8px 10px;';
        style.innerHTML +='display:inline-block;';
        style.innerHTML +='cursor:pointer;';
        style.innerHTML +='font-size:19px;';
        style.innerHTML +='font-weight:bold;';
        style.innerHTML +='text-align: center;';
        style.innerHTML +='text-decoration:none;';
        style.innerHTML +='background-color: #641515;';
        style.innerHTML +='width:48px;';
        style.innerHTML +='color: white;';
        style.innerHTML +=' }';
        document.getElementsByTagName('head')[0].appendChild(style);
        
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.defaultOn_btn_class { ';
        style.innerHTML +='border-radius:40px;';
        style.innerHTML +='border:2px solid #aaaa22;';
        style.innerHTML +='padding:8px 10px 8px 10px;';
        style.innerHTML +='display:none;';
        style.innerHTML +='cursor:pointer;';
        style.innerHTML +='font-size:19px;';
        style.innerHTML +='font-weight:bold;';
        style.innerHTML +='text-align: center;';
        style.innerHTML +='text-decoration:none;';
        style.innerHTML +='background-color: #156415;';
        style.innerHTML +='width:48px;';
        style.innerHTML +='color: white;';
        style.innerHTML +=' }';
        document.getElementsByTagName('head')[0].appendChild(style);
        
        //document.getElementById('someElementId').className = 'cssClass';
    }
};

