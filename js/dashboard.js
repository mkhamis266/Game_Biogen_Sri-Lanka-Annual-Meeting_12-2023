let playersArr = [];
$(async function () {
  $('.results-container').empty();
  const playersData = await loadFromFirebase();
  for (const playerId in playersData) {
    playersData[playerId].id = playerId;
    playersArr.push(playersData[playerId]);
  }

  playersArr.sort(function (a, b) {
    return b.score - a.score;
  });

  for (let i = 0; i < playersArr.length; i++) {
    const tr = $('<tr/>', {
      id: playersArr[i].id,
    }).html(`
    <td>${playersArr[i].name}</td>
    <td>${playersArr[i].email}</td>
    <td>${playersArr[i].score}</td>
    <td class="text-center">
      <button class="btn btn-danger" onclick="deletePlayer('${playersArr[i].id}')">delete</button>
    </td>
    `);
    $('.results-container').append(tr);
  }
});

function download() {
  filename = 'Game_Biogen - Ignite Me Game_report.xlsx';
  const ws = XLSX.utils.json_to_sheet(playersArr);
  var wb = XLSX.utils.book_new();

  /* Export to file (start a download) */
  XLSX.utils.book_append_sheet(wb, ws, 'players');
  XLSX.writeFile(wb, filename);
}
