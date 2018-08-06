const visits = [];

const handleNotification = notification => {
  const { data } = notification;
  switch (data.type) {
    case "VISIT ACCESS":
      onVisitAccess(data.data);
      return;
  }
};

const onVisitAccess = data => {
  console.log("DATA!", data);
  if (data.access)
    notify.info(`Acceso concedido a ${data.visit.guest.name}`, "Éxito");
  else notify.error(`Acceso denegado a ${data.visit.guest.name}`, "Error");

  visits.push({
    resident: data.visit.resident,
    guest: data.visit.guest,
    time: new Date(),
    access: data.access
  });
  if (visits.length > 5) visits.shift();
  renderAccess(visits);
};

const renderAccess = visits => {
  $("#accessTable").empty();
  visits.forEach(visit => {
    $("#accessTable").append(renderItem(visit));
  });
};

const renderItem = visit => {
  return `<tr>
    <td>
      <p class="mb-0 small">${visit.resident.name}</p>
    </td>
    <td>
      <p class="mb-0 small">${visit.guest.name}</p>
   </td>
   <td>
   <p class="mb-0 small">${visit.access ? "APROBADO" : "NEGADO"}</p>
 </td>
    <td>
      <p class="mb-0 small">
      ${moment(visit.time).fromNow()}
      </p>
    </td>
  </tr>`;
};
