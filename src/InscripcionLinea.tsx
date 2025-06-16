import { useNavigate } from 'react-router-dom';
import './App.css';

const InscripcionLinea = () => {
    const navigate = useNavigate();

  const manejarInicioSesion = () => {
    // Aquí puedes validar el recibo y el DNI si deseas
    navigate('/completar-registro');
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
            <input type="text" className='login' />
            <label>N° de DNI / D.L.I.:</label>
            <input type="text"  className='login' />        
        </div>
        <button className="btn-iniciar" onClick={manejarInicioSesion}>Inicio de Sesión</button>
      </div>      
      <div className="nota">
        <p><b>Número de Recibo:</b> Número que aparece impreso en el recibo y que debe coincidir con el que aparece en el comprobante de pago que entrega el banco al momento de su cancelacion</p>
        <p><b>N° de DNI / D.L.I:</b> Es el número de DNI (En caso de ser peruano) o el número de Pasaporte o Carné de extranjería (En caso de ser Extranjero) y que debe coincidir con el número de documento de identidad que ingresó al momento de generar su recibo</p>
      </div>

      </div>

      
    </div>
  );
};

export default InscripcionLinea;
