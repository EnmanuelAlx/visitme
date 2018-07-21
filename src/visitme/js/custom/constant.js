/*exported MONTHS_NAMES DATATABLES_SPANISH FORM_VALIDATION_DEFAULTS ENVIRONMENT DOCUMENT_CLASSIFICATIONS KEYS_TO_SANITIZE  APPLICATION_FLOWS SAMMY_STORE DUPLICATED_DOMAIN TIME_FORMAT TOASTR_OPTIONS PAYMENT_PLANS AMPLITUDE_KEY BROKER_PORTAL_THEMES ACCOUNTS_API DOCUMENTS_API MAIN_API S3_BUCKET_URL ERROR_HEADER FORMS_RELATED CHECK_MESSAGE_E CLIENT_PORTAL_MENU BROKER_PORTAL_MENU PROGRESS_MESSAGE_E  LOADING_MESSAGE_E SUBMIT_MESSAGE_E ERROR_SPAN DOCUMENT_SUCCESS*/

const ENVIRONMENT = "@@environment";
const ERROR_HEADER = "<strong> Server Error </strong>";
const CHECK_MESSAGE_E = "Check your details and try again.";
const LOADING_MESSAGE_E = "There was an error while loading your information";;
const PROGRESS_MESSAGE_E =
  "An error occurred  when trying to save your information. Check and try again";


const MAIN_API = "@@mainApi";

const TOASTR_OPTIONS = {
  positionClass: "toast-bottom-right",
  timeOut: "50000",
  extendedTimeOut: "50000",
  closeButton: true,
  preventDuplicates: true
};

const TIME_FORMAT = "YYYY-MM-DD";

const SAMMY_STORE = name => ({
  name: name,
  element: "body",
  type: "local"
});

const KEYS_TO_SANITIZE = ["givenName", "familyName", "email", "middleName"];


const FORM_VALIDATION_DEFAULTS = {
  focusCleanup: true,
  errorPlacement: (label, element) => {
    label.addClass("invalid-feedback");
    label.insertAfter(element);
  },
  lang: "es",
  wrapper: "div"
};

const MONTHS_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

const DATATABLES_SPANISH = {
  "sProcessing": "Procesando...",
  "sLengthMenu": "Mostrar _MENU_ registros",
  "sZeroRecords": "No se encontraron resultados",
  "sEmptyTable": "Ningún dato disponible en esta tabla",
  "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
  "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
  "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
  "sInfoPostFix": "",
  "sSearch": "Buscar:",
  "sUrl": "",
  "sInfoThousands": ",",
  "sLoadingRecords": "Cargando...",
  "oPaginate": {
    "sFirst": "Primero",
    "sLast": "Último",
    "sNext": "Siguiente",
    "sPrevious": "Anterior"
  },
  "oAria": {
    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
  }
};
