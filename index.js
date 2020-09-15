const http = require('http');
const fs = require('fs');
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const URL_PROVEEDORES = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const URL_CLIENTES = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

const URL_HTML_CLIENTES = "./public/clientes.html"; 
const URL_HTML_PROVEEDORES = "./public/proveedores.html"; 
const URL_HTML_TEMPLATE = "./public/template.html"; 
const template = fs.readFileSync(URL_HTML_TEMPLATE);

const hostname = '127.0.0.1';
const port = 8081;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  const {url} = req;
  if(url === "/api/proveedores"){
    axios.get(URL_PROVEEDORES).then(response => {
        const proveedores = response.data;
        generarHTMLProveedores(proveedores);
        const html = fs.readFileSync(URL_HTML_PROVEEDORES);
        res.write(html);
        res.end();
    });
  }
  else if(url === "/api/clientes"){
    axios.get(URL_CLIENTES).then(response => {
        const clientes = response.data;
        generarHTMLClientes(clientes);
        const html = fs.readFileSync(URL_HTML_CLIENTES);
        res.write(html);
        res.end();
    });
  }
  else
    res.end("No se encontró la ruta");
});

server.listen(port, hostname, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
  console.log(`Acceso a los proveedores: http://${hostname}:${port}/api/proveedores`);
  console.log(`Acceso a los clientes: http://${hostname}:${port}/api/clientes`);  
});


/**
 * Funciones auxiliares
 */
function generarHTMLClientes(clientes) {
    const DOMClientes = new JSDOM(template);
    const { document } = DOMClientes.window;

    let tittle = document.getElementsByTagName("h2")[0]
    tittle.innerHTML = "Listado de clientes";
    tittle.style.textAlign = "center";


    const tableElement = document.getElementById("tableEdit");
    let tbody = tableElement.getElementsByTagName("tbody")[0];

    for(let cliente of clientes){
        let row = tbody.insertRow(-1);

        let idProveedorCell = row.insertCell(0);
        idProveedorCell.innerHTML = cliente.idCliente;

        let companiaCell  = row.insertCell(1);
        companiaCell.innerHTML = cliente.NombreCompania;

        let nombreContactoCell = row.insertCell(2);
        nombreContactoCell.innerHTML = cliente.NombreContacto;
    }

    fs.writeFileSync(URL_HTML_CLIENTES, document.documentElement.outerHTML);

}

function generarHTMLProveedores(proveedores) {
    const DOMProovedores = new JSDOM(template);
    const { document } = DOMProovedores.window;

    let tittle = document.getElementsByTagName("h2")[0]
    tittle.innerHTML = "Listado de proveedores";
    tittle.style.textAlign = "center";


    const tableElement = document.getElementById("tableEdit");
    let tbody = tableElement.getElementsByTagName("tbody")[0];

    for(let proveedor of proveedores){
        let row = tbody.insertRow(-1);

        let idProveedorCell = row.insertCell(0);
        idProveedorCell.innerHTML = proveedor.idproveedor;

        let companiaCell  = row.insertCell(1);
        companiaCell.innerHTML = proveedor.nombrecompania;

        let nombreContactoCell = row.insertCell(2);
        nombreContactoCell.innerHTML = proveedor.nombrecontacto;
    }

    fs.writeFileSync(URL_HTML_PROVEEDORES, document.documentElement.outerHTML);
}
