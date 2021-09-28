$(document).ready(function () {
  $(".action").on("click", ".btn-kurang", function (e) {
    e.preventDefault();
    let i = parseInt($(this).siblings("input").val()) - 1;
    if (i < 1) {
      i = 0;
    }
    $(this).siblings("input").val(i);
    totalMakanan();
    totalMinuman();
    totalHarga();
  });

  $(".action").on("click", ".btn-tambah", function (e) {
    e.preventDefault();
    let i = parseInt($(this).siblings("input").val()) + 1;
    $(this).siblings("input").val(i);
    totalMakanan();
    totalMinuman();
    totalHarga();
  });

  const totalMakanan = () => {
    let makanan = parseInt($("#foodA").val()) + parseInt($("#foodB").val());
    $(".list").find(".makan").html(makanan);
  };
  const totalMinuman = () => {
    let minuman = parseInt($("#drinkA").val()) + parseInt($("#drinkB").val());
    $(".list").find(".minum").html(minuman);
  };
  const totalHarga = () => {
    let total =
      parseInt($("#foodA").val()) * 12000 +
      parseInt($("#foodB").val()) * 8000 +
      (parseInt($("#drinkA").val()) * 3000 +
        parseInt($("#drinkB").val()) * 4000);
    if (total == 0) {
      $(".price").find(".harga").html("0");
    }
    $(".price").find(".harga").html(total);
  };
});
