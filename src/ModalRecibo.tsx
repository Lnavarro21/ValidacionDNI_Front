import React from 'react';
import './ModalRecibo.css';

interface ModalReciboProps {
  isOpen: boolean;
  onClose: () => void;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroDocumento: string;
  concepto: string;
  idSede: number;
  idModalidad: number;
  idEscuela: number;
}

const ModalRecibo: React.FC<ModalReciboProps> = ({
  isOpen,
  onClose,
  nombres,
  apellidoPaterno,
  apellidoMaterno,
  numeroDocumento,
  concepto,
  idSede,
  idModalidad,
  idEscuela
}) => {
  if (!isOpen) return null;

  const fechaVencimiento = new Date();
  fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
  const fechaVenc = `${fechaVencimiento.getDate()}/${fechaVencimiento.getMonth() + 1}/${fechaVencimiento.getFullYear()}`;
  const codigoMatricula = `0000${numeroDocumento}`;

  const generarYDescargarRecibo = async () => {
  try {
    const registroBody = {
      documento: numeroDocumento,
      idSede,
      idEscuela,
      idModalidad
    };

    const registroResponse = await fetch(
      "https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/opcion1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registroBody),
      }
    );

    if (!registroResponse.ok) throw new Error("Error al registrar la opción 1");

    const pdfResponse = await fetch(
      "https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/generarPDF",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/pdf", // importante
        },
        body: JSON.stringify({ numeroDocumento }),
      }
    );

    if (!pdfResponse.ok) throw new Error("Error al generar el recibo");

    const blob = await pdfResponse.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");

    const a = document.createElement("a");
    a.href = url;
    a.download = `Recibo_${new Date().toISOString().slice(0, 16).replace(/[-T:]/g, "")}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
    onClose();

  } catch (error) {
    console.error("Error generando el recibo:", error);
    alert("Hubo un problema al generar el recibo.");
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Datos del Postulante</h2>
        <p><span>NÚMERO DE MATRÍCULA:</span> {codigoMatricula}</p>
        <p><span>NOMBRES:</span> {nombres}</p>
        <p><span>APELLIDO PATERNO:</span> {apellidoPaterno}</p>
        <p><span>APELLIDO MATERNO:</span> {apellidoMaterno}</p>
        <p><span>CONCEPTO:</span> {concepto}</p>
        <p><span>MONTO:</span> S/ 350.00</p>
        <p><span>FECHA DE VENCIMIENTO:</span> {fechaVenc}</p>
        <p><span>FACULTAD:</span> ---</p>
        <p><span>ESCUELA:</span> ---</p>
        <p><span>PROGRAMA:</span> ---</p>

        <div className="info-text">
          Los datos ingresados en el formulario, le deben pertenecer <b>única y exclusivamente</b> al postulante.
          Si los datos ingresados no pertenecen al postulante, corríjalos, caso contrario ignore este mensaje.
          <br /><br />
          ¿Estás seguro de generar el recibo con los siguientes datos?
        </div>

        <div className="modal-buttons">
          <button onClick={generarYDescargarRecibo}>Aceptar</button>
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalRecibo;
