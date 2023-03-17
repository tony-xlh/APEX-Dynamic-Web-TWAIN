# APEX-Dynamic-Web-TWAIN

APEX Plug-in to scan documents using [Dynamic Web TWAIN](https://www.dynamsoft.com/web-twain/overview/).

It can display a modal to scan documents and display the selected scanned document in an image element.

The following events are supported:

```
apex.region("region_id").showModal(); => show the document scanner,
apex.region("region_id").hideModal(); => hide the document scanner,
apex.region("region_id").getBase64(); => get the base64 of the scanned document,
apex.region("region_id").getFilename(); => get the filename of the uploaded document. The file is uploaded to a remote server if the host and port are specified.
```

[Online demo](https://apex.oracle.com/pls/apex/r/dynamsoft/dynamsoft-demos/document-scanner)