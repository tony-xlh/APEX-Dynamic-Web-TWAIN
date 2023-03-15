let DWTExtension = {
  modal:undefined,
  DWObject:undefined,
  load: async function(){
    await this.loadLibrary("https://unpkg.com/dwt@18.0.0/dist/dynamsoft.webtwain.min.js","text/javascript");
    await this.loadStyle("style.css");
    Dynamsoft.DWT.AutoLoad = false;
    Dynamsoft.DWT.ResourcesPath = "https://unpkg.com/dwt@18.0.0/dist";
    this.addButton();
  },
  addButton: function (){
    const button = document.createElement("div");
    button.className = "dwt-fab";
    const a = document.createElement("a")
    a.href = "javascript:void(0)";
    const icon = document.createElement("img")
    icon.src = "scanner-scan.svg"
    a.appendChild(icon);
    button.appendChild(a);
    document.body.appendChild(button);
    button.addEventListener("click", () => {
      this.showModal();
    });
  },
  showModal: function(){
    if (!this.modal) {
      this.modal = document.createElement("div");
      this.modal.className = "dwt-modal";
      document.body.appendChild(this.modal);
      const header = document.createElement("div");
      const closeBtn = document.createElement("div");
      closeBtn.className = "dwt-close-btn";
      closeBtn.innerText = "x";
      header.appendChild(closeBtn);
      header.className = "dwt-header";
      closeBtn.addEventListener("click", () => {
        this.hideModal();
      });
      const body = document.createElement("div");
      body.className = "dwt-body";
      const viewer = document.createElement("div");
      viewer.id = "dwtcontrolContainer";
      const controls = document.createElement("div");
      controls.className = "dwt-controls";
      const scanBtn = document.createElement("button");
      scanBtn.innerText = "Scan";
      scanBtn.addEventListener("click", () => {
        this.scan();
      });

      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.addEventListener("click", () => {
        this.edit();
      });
      
      const copyBtn = document.createElement("button");
      copyBtn.innerText = "Copy selected";
      copyBtn.addEventListener("click", () => {
        this.copy();
      });
  
      const saveBtn = document.createElement("button");
      saveBtn.innerText = "Save";
      saveBtn.addEventListener("click", () => {
        this.save();
      });
  
      const status = document.createElement("div");
      status.className="dwt-status";
  
      controls.appendChild(scanBtn);
      controls.appendChild(editBtn);
      controls.appendChild(copyBtn);
      controls.appendChild(saveBtn);
      controls.appendChild(status);
  
      body.appendChild(viewer);
      body.appendChild(controls);
      this.modal.appendChild(header);
      this.modal.appendChild(body);
      if (!this.DWObject) {
        this.initDWT();
      }
    }
    this.modal.style.display = "";
  },
  hideModal: function() {
    this.modal.style.display = "none";
  },
  scan: function(){
    if (this.DWObject) {
      if (Dynamsoft.Lib.env.bMobile) {
        this.DWObject.Addon.Camera.scanDocument();
      }else {
        this.DWObject.SelectSource(function () {
          DWTExtension.DWObject.OpenSource();
          DWTExtension.DWObject.AcquireImage();
        },
          function () {
            console.log("SelectSource failed!");
          }
        );
      }
    }
  },
  edit: function(){
    if (this.DWObject) {
      let imageEditor = this.DWObject.Viewer.createImageEditor();
      imageEditor.show();
    }
  },
  copy: function(){
    if (this.DWObject) {
      if (Dynamsoft.Lib.env.bMobile) {
        this.DWObject.ConvertToBlob(
          [this.DWObject.CurrentImageIndexInBuffer],
          Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG,
          function(result) {
            DWTExtension.CopyBlobToClipboard(result);
          },
          function(errorCode,errorString) {
            console.log("convert failed");
            console.log(errorString);
            alert("Failed");
          });
      }else{
        this.DWObject.CopyToClipboard(this.DWObject.CurrentImageIndexInBuffer);
        alert("Copied");
      }
    }
  },
  CopyBlobToClipboard: function(blob){
    var data = [new ClipboardItem({ "image/png": blob})];
    navigator.clipboard.write(data).then(function() {
      alert("Copied");
    }, function() {
      alert("Failed");
    });
  },
  save: function () {
    if (this.DWObject) {
      this.DWObject.SaveAllAsPDF("Scanned");
    }
  },
  initDWT: function(){
    const status = document.querySelector(".dwt-status");
    Dynamsoft.DWT.Containers = [{ ContainerId: 'dwtcontrolContainer',Width: 270, Height: 350 }];
    Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', function () {
      console.log("ready");
      status.innerText = "";
      DWTExtension.DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');
      DWTExtension.DWObject.Viewer.width = "100%";
      DWTExtension.DWObject.Viewer.height = "100%";
      DWTExtension.DWObject.SetViewMode(2,2);
    });
    status.innerText = "Loading...";
    Dynamsoft.DWT.Load();
  },
  loadLibrary: function (src,type,id,data){
    return new Promise(function (resolve, reject) {
      let scriptEle = document.createElement("script");
      scriptEle.setAttribute("type", type);
      scriptEle.setAttribute("src", src);
      if (id) {
        scriptEle.id = id;
      }
      if (data) {
        for (let key in data) {
          scriptEle.setAttribute(key, data[key]);
        }
      }
      document.body.appendChild(scriptEle);
      scriptEle.addEventListener("load", () => {
        console.log(src+" loaded")
        resolve(true);
      });
      scriptEle.addEventListener("error", (ev) => {
        console.log("Error on loading "+src, ev);
        reject(ev);
      });
    });
  },
  loadStyle: function (url) {
    return new Promise(function (resolve, reject) {
      let linkEle = document.createElement('link')
      linkEle.type = 'text/css'
      linkEle.rel = 'stylesheet'
      linkEle.href = url
      let head = document.getElementsByTagName('head')[0]
      head.appendChild(linkEle)
      linkEle.addEventListener("load", () => {
        console.log(url+" loaded")
        resolve(true);
      });
      linkEle.addEventListener("error", (ev) => {
        console.log("Error on loading "+url, ev);
        reject(ev);
      });
    });
  }
}

DWTExtension.load();