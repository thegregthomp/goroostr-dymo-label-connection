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
   console.log(typeof labels);
   for (const key in labels) {
      printers(labels[key].id, labels[key].type);
    }
   res.send('label printed');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const printers = async (id, type) => {
   try {
   const printers = await Dymo.getPrinters();
   //  console.log(printers);
   const genXml = orderLabel(id, type);
    console.log(genXml);
    const renderedXML = await Dymo.renderLabel(genXml);
    console.log(renderedXML)
   //  QRCode.toString('http://www.google.com', {
   //    type: 'svg'
   //  }, function (err, string) {
   // if (err) throw err
   // console.log(string)
   // })
    const label = await Dymo.printLabel(printers.data[0].name, genXml);
    return printers;
   } catch (err) {
      console.log(err);
   }
}