import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

const InscripcionLinea = () => {
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [recibo, setRecibo] = useState('');

  const manejarInicioSesion = async () => {
    if (!dni) {
      alert('Debe ingresar el DNI.');
      return;
    }

    try {
      const response = await fetch(
        `https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/postulanteLogin?Documento=${dni}`
      );

      if (!response.ok) throw new Error('Error al obtener el ID del postulante');

      const data = await response.json();
      localStorage.setItem('idPostulante', data.idPostulante);
      navigate('/completar-registro');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('No se pudo iniciar sesión. Verifica el DNI.');
    }
  };

  return (
    <div className="contenedor-principal">
      <div className="formulario">
        <div className="icono-encabezado">
          <img
            src="https://admision.usmp.edu.pe/img/oficinadeadmision2.png"
            alt="Oficina de Admisión USMP"
            className="logo-usmp"
          />
        </div>

        <div className="barra-navegacion">
          <button>Genera tu Recibo</button>
          <button>Inscripción en Línea</button>
          <button>Simulador de Escalas</button>
        </div>

        <h2 className="titulo-pagina2">INSCRIPCIÓN EN LÍNEA</h2>
        <p className="descripcion">
          Para iniciar la Inscripción en Línea debes <a href="#">generar tu recibo</a> y cancelarlo en cualquier agencia de INTERBANK, BCP, SCOTIABANK, BBVA o BANBIF
        </p>

        <div className='contenedor-login'>
          <div className="formulario-login">
            <label>Número del Recibo Generado:</label>
            <input
              type="text"
              className='login'
              value={recibo}
              onChange={(e) => setRecibo(e.target.value)}
            />
            <label>N° de DNI / D.L.I.:</label>
            <input
              type="text"
              className='login'
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>
          <button className="btn-iniciar" onClick={manejarInicioSesion}>Inicio de Sesión</button>
        </div>

        <div className="nota">
          <p><b>Número de Recibo:</b> Número que aparece impreso en el recibo y que debe coincidir con el que aparece en el comprobante de pago que entrega el banco al momento de su cancelación</p>
          <p><b>N° de DNI / D.L.I:</b> Es el número de DNI (en caso de ser peruano) o el número de Pasaporte o Carné de extranjería (en caso de ser extranjero) y debe coincidir con el documento usado al generar su recibo</p>
        </div>
      </div>
    </div>
  );
};

export default InscripcionLinea;
