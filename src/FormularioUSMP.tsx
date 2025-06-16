import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import ModalRecibo from './ModalRecibo';

const FormularioUSMP = () => {
  const [tipoDoc, setTipoDoc] = useState<number>(1);
  const [numero, setNumero] = useState('');
  const [verificador, setVerificador] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [nombres, setNombres] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [tiposDocumento, setTiposDocumento] = useState<{ idDocumento: number; documento: string }[]>([]);
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [bloquearFormulario, setBloquearFormulario] = useState(false);
  const [sedes, setSedes] = useState<{ idSede: number; sede: string }[]>([]);
  const [modalidades, setModalidades] = useState<{ idModalidad: number; modalidad: string }[]>([]);
  const [escuelas, setEscuelas] = useState<{ idEscuela: number; escuela: string }[]>([]);

  const [sedeSeleccionada, setSedeSeleccionada] = useState<number | null>(null);
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState<number | null>(null);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState<number | null>(null);

  const [mostrarModal, setMostrarModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/listaTipoDocumento")
      .then(res => res.json())
      .then(data => setTiposDocumento(data.lista))
      .catch(err => console.error("Error cargando tipos de documento:", err));
  }, []);

  const handleTipoDocChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoTipo = Number(e.target.value);
    setTipoDoc(nuevoTipo);
    setNumero('');
    setVerificador('');
    setApellidoPaterno('');
    setApellidoMaterno('');
    setNombres('');
    setMensajeError('');
  };

  useEffect(() => {
    const tipoSeleccionado = tiposDocumento.find(doc => doc.idDocumento === tipoDoc);

    if (tipoSeleccionado?.documento === "DNI" && numero.length === 8 && verificador.length === 1) {
      const consultarAPI = async () => {
        try {
          const response = await axios.post(
            'https://apiperu.dev/api/dni',
            { dni: numero },
            {
              headers: {
                Authorization: 'Bearer 5ef0d9fc00e59293384a9977675e95edd75cae1e1044c4077f9f78715ffac1d8',
                'Content-Type': 'application/json',
                Accept: 'application/json'
              }
            }
          );

          if (response.data.success && String(response.data.data.codigo_verificacion) === verificador) {
            setApellidoPaterno(response.data.data.apellido_paterno);
            setApellidoMaterno(response.data.data.apellido_materno);
            setNombres(response.data.data.nombres);
            setMensajeError('');
          } else {
            setMensajeError('DNI o código incorrecto');
            setApellidoPaterno('');
            setApellidoMaterno('');
            setNombres('');
          }

          console.log('Respuesta API:', response.data);
        } catch (err) {
          console.error('Error al consultar la API:', err);
          setMensajeError('Error al consultar el DNI');
        }
      };

      consultarAPI();
    }
  }, [numero, verificador, tipoDoc, tiposDocumento]);

  useEffect(() => {
    if (registroExitoso) {
      const fetchDatosRecibo = async () => {
        try {
          const [resSedes, resModalidades, resEscuelas] = await Promise.all([
            fetch("https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/listaSede"),
            fetch("https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/listaModalidad"),
            fetch("https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/listaEscuela")
          ]);

          const dataSedes = await resSedes.json();
          const dataModalidades = await resModalidades.json();
          const dataEscuelas = await resEscuelas.json();

          setSedes(dataSedes.lista);
          setModalidades(dataModalidades.lista);
          setEscuelas(dataEscuelas.lista);
        } catch (error) {
          console.error("Error al cargar datos del recibo:", error);
        }
      };

      fetchDatosRecibo();
    }
  }, [registroExitoso]);


  const handleRegistrar = async () => {
    try {
      const body = {
        idTipoDocumento: tipoDoc,
        documento: numero,
        apellidoPaterno,
        apellidoMaterno,
        nombres,
        email: correo,
        celular: telefono
      };

      const response = await axios.post(
        'https://registropostulantes-ezeqcre4c4d6deey.canadacentral-01.azurewebsites.net/api/ValidacionDNI/registrar',
        body
      );
      const data = response.data;

      if (data.idTipoMensaje === 2) {
        setMensajeError('');
        setRegistroExitoso(true);
        setBloquearFormulario(true);
      } else {
        setMensajeError(data.mensaje || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error al registrar los datos:', error);
      alert('Hubo un error al registrar los datos');
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
          <button onClick={() => navigate('/inscripcion')}>Inscripción en Línea</button>
          <button>Simulador de Escalas</button>
        </div>

        <div className="seccion formulario-postulante">
          <h2>Datos del Postulante</h2>
          <div className="fila">
            <select value={tipoDoc} onChange={handleTipoDocChange} disabled={bloquearFormulario}>
              {tiposDocumento.map(doc => (
                <option key={doc.idDocumento} value={doc.idDocumento}>
                  {doc.documento}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={numero}
              className='numdoc'
              onChange={(e) => setNumero(e.target.value)}
              maxLength={tipoDoc === 1 ? 8 : 15}
              pattern={tipoDoc === 1 ? '[0-9]*' : undefined}
              inputMode={tipoDoc === 1 ? 'numeric' : 'text'}
              readOnly={bloquearFormulario}
            />

            {tipoDoc === 1 && (
              <input
                type="text"
                value={verificador}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d?$/.test(val)) setVerificador(val);
                }}
                maxLength={1}
                style={{ width: '50px' }}
                readOnly={bloquearFormulario}
              />
            )}
          </div>

          {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

          <div className="grid">
            <label className='etiquetas'>Apellido Paterno</label>
            <input
              type="text"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              readOnly={tipoDoc === 1 || bloquearFormulario}
            />
            <label className='etiquetas'>Apellido Materno</label>
            <input
              type="text"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              readOnly={tipoDoc === 1 || bloquearFormulario}
            />
            <label className='etiquetas'>Nombres</label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              readOnly={tipoDoc === 1 || bloquearFormulario}
            />
            <label className='etiquetas'>Telefono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              readOnly={bloquearFormulario}
            />
            <label className='etiquetas'>Correo</label>
            <input
              type="email"
              className="colspan"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              readOnly={bloquearFormulario}
            />
          </div>

          <div className="botones">
            <button className="btn-rojo" onClick={handleRegistrar} disabled={bloquearFormulario}>Registrar</button>
            <button className="btn-gris">Limpiar Datos</button>
          </div>
        </div>

        {registroExitoso && <p className="mensaje-info">Genera el recibo para continuar con el proceso</p>}

        {registroExitoso && (
          <div className="seccion formulario-recibo">
            <h2>Datos de Recibo</h2>
            <div className="tabs">
              {["Pregrado", "Ciclo Cero", "Postgrado", "Virtual", "Centro de Idiomas", "EPU's / Instituciones"].map((label) => (
                <button key={label}>{label}</button>
              ))}
            </div>
            <div className="segundoform">
              <label> Sede 
              <select value={sedeSeleccionada ?? ''} onChange={(e) => setSedeSeleccionada(Number(e.target.value))}>
                <option value="">SEDE</option>
                {sedes.map(s => (
                  <option key={s.idSede} value={s.idSede}>{s.sede}</option>
                ))}
              </select>
              </label>
              <label> Modalidad 
              <select value={modalidadSeleccionada ?? ''} onChange={(e) => setModalidadSeleccionada(Number(e.target.value))}>
                <option value="">MODALIDAD</option>
                {modalidades.map(m => (
                  <option key={m.idModalidad} value={m.idModalidad}>{m.modalidad}</option>
                ))}
              </select>
              </label>
              <label> Escuela
              <select value={escuelaSeleccionada ?? ''} onChange={(e) => setEscuelaSeleccionada(Number(e.target.value))}>
                <option value="">ESCUELA</option>
                {escuelas.map(e => (
                  <option key={e.idEscuela} value={e.idEscuela}>{e.escuela}</option>
                ))}
              </select>
              </label>
            </div>
             <button className="btn-rojo" onClick={() => setMostrarModal(true)}>
              Generar Recibo
             </button>
          </div>
        )}
        <ModalRecibo
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          nombres={nombres}
          apellidoPaterno={apellidoPaterno}
          apellidoMaterno={apellidoMaterno}
          numeroDocumento={numero}
          concepto={modalidades.find(m => m.idModalidad === modalidadSeleccionada)?.modalidad || '---'}
          idModalidad={modalidadSeleccionada ?? 0}
          idSede={sedeSeleccionada ?? 0}
          idEscuela={escuelaSeleccionada ?? 0}
        />
      </div>
    </div>
  );
};

export default FormularioUSMP;
