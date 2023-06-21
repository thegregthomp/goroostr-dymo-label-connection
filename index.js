const Dymo = require('dymo-connect');
var QRCode = require('qrcode');
// export NODE_TLS_REJECT_UNAUTHORIZED=1
const {orderLabel} = require('./xml/order');

const express = require('express');
const app = express();
const port = 3000;

app.get('/status', async (req, res) => {
   res.status(200).send('Success');
})

app.get('/print/', async (req, res) => {
   const labels = req.query;
   for (const key in labels) {
      printers(labels[key].id, labels[key].type);
    }
   res.send('label printed');
})

app.get('/printers/', async (req, res) => {
   const printers = await Dymo.getPrinters();
   res.send(printers);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const printers = async (id, type) => {
   try {
   const printers = await Dymo.getPrinters();
   const genXml = orderLabel(id, type);
    const renderedXML = await Dymo.renderLabel(genXml);
    const label = await Dymo.printLabel(printers.data[0].name, genXml);
    return printers;
   } catch (err) {
      console.log(err);
   }
}