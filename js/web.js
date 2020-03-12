
$( ".choices" ).each(function( index ) {
  var choiceName = 'choice'+index;
   $( this ).attr('data-img-choice', choiceName);
});

var selectedImages=[];
var removedImagesIndex=[];
var viewedImage='';
var SelectedMarkup='<p class="position-absolute selected-image"> <i class="fa fa-check image-ticked"></i> </p>';
var imageChoice='';
var imageToSelect='';
var setSelectedImageTo='';
var maxCarToSelect = 3;



//$('#formModal').modal('show');

$('.choices').on('click', function () {
  showFormModal();
  // Check if car has been selected
  if ($(this).find("p").length > 0) {
    return;
  }

  // Check numbers of selected cars
    if(selectedImages.length>=3){
        return;
    }
    // Getting selected car info
    viewedImage = $(this).children('img').attr('src');
    imageChoice = $(this).data("img-choice");
    imageToSelect=$(this);

    // Setting selected car as popup image
    $("#modalImage").attr('src',viewedImage);

    $("#selectedCarName").text( $(this).parent().children('p').text());

    $('#carSelectionModal').modal('show');

}); // END choices click to show popup for selection.

  $('.selectImage').on('click', function () {

      // Reseting Removed tracking array
      if(!selectedImages.length){removedImagesIndex = [];}
      var imageName = $(this).parent().children('p').text();
      var selectedImage = $(this).parent().parent().children('img').attr('src');
      selectedImages.push(selectedImage);
      var imgNum =0;
      
      if( removedImagesIndex.length && selectedImages.length)
      {
        imgNum = removedImagesIndex[removedImagesIndex.length-1];
        var index = removedImagesIndex.indexOf(imgNum);
        if (index > -1) {
            removedImagesIndex.splice(index, 1);
        }  
      }
      else
      {
        imgNum = selectedImages.length;
      }

      // Getting footer image to set selected image
      setSelectedImageTo = $("#finalImage"+imgNum);

      setTimeout(function(){ 
        imageToSelect.prepend(SelectedMarkup); 
        setSelectedImageTo.attr('src',selectedImage);
        setSelectedImageTo.parent().parent().children('span').removeClass('invisible');
        $('.remainingCars').text(--maxCarToSelect);
        
      }, 350);
      setSelectedImageTo.attr('data-selected-car',imageChoice);
      setTimeout(() => {
        showFormModal();  
      }, 600);
        
  });
 
// Deleting footer selected image
$('.removeSelecetedImage').on('click', function () {
 
    var img_number = $(this).parent().children('div').children('img').data("img-num");
    var index = selectedImages.indexOf($(this).parent().children('div').children('img').attr('src'));
    if (index > -1) {
        selectedImages.splice(index, 1);
        removedImagesIndex.push(img_number);   
        
        $("#finalImage"+img_number).attr('src','');
        $("#finalImage"+img_number).parent().parent().children('span').addClass('invisible');

        $('.remainingCars').text(++maxCarToSelect);
        // Removing selected image overlay
      var carHavingOverlay=  $("#finalImage"+img_number).attr('data-selected-car');
      $("[data-img-choice="+carHavingOverlay+"]").find("p:first").remove();
    }  
});


$("#prizeForm").submit(function(e) {
    e.preventDefault();
    var fullName =$("#fullName").val();
    var phone =$("#phone").val();
    var emailAddress =$("#emailAddress").val();
    var isEmailValid = ValidateEmail(emailAddress);
    console.log($('#acknowledge').prop('checked'));
    var isAcknowledge = !$('#acknowledge').prop('checked');
    // Validating form fields
    // Showing error message
    if(fullName == '' || phone == '' || emailAddress == '' || !isEmailValid || isAcknowledge)
      {
        var errorMessage = (fullName == '' || phone == '' || emailAddress == '' || isAcknowledge) ?'לא מולאו כל שדות' : 'הזן דוא"ל חוקי';
        $("#errorMessage").text(errorMessage);
        $("#errorMessage").removeClass('invisible').addClass('slideInDown');
    }
    else
    {
      // Submit the form
      // Send request to Server here

      $("#spinner").removeClass("invisible");
      $("#submitBtn").prop('disabled', true);
      setTimeout(() => {
        $("#spinner").addClass("invisible");
        $("#submitBtn").prop('disabled', false);
        // Showing final thank you message
        $('#formModal').modal('hide');
        setTimeout(() => {$('#thankYouModal').modal('show');}, 600)
      }, 2000);      
    }
});

$('#thankYouModal').on('hidden.bs.modal', function () {
  resetApp();
});


$('#formModal').on('hidden.bs.modal', function () {
  resetFormFields();
});

// Hiding Error Message

$("#prizeForm input[type='text'], #prizeForm input[type='email']").keypress(function(){
  hideErrorMessage();
});

$('#acknowledge').change(function() {
  if(this.checked) {
    hideErrorMessage();
  }
});

function hideErrorMessage(){
  $("#errorMessage").addClass('slideOutUp').removeClass('slideInDown');
  setTimeout(function(){ 
     $("#errorMessage").addClass('invisible').removeClass('slideOutUp');
   }, 400);
}

function ValidateEmail(email) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return (true);
  }
    return (false);
}

 
function showFormModal(){
  // Check numbers of selected cars 
  if(selectedImages.length>=3){
    $('#formModal').modal('show');
    return;
  }
}
// Reseting all variables and mark ups
function resetApp(){

  imageChoice='';
  imageToSelect='';
  setSelectedImageTo='';
  maxCarToSelect = 3;
  
  selectedImages=[];
  removedImagesIndex=[];
  viewedImage='';
  $('.choices').find("p:first").remove();
  $(".removeSelecetedImage").addClass('invisible');
  $(".removeSelecetedImage").parent().children('div').children('img').attr('src', '');

  $('.remainingCars').text("3");
  resetFormFields();
}

function resetFormFields(){
  
  $("#prizeForm input[type='text'], #prizeForm input[type='email']").val('');
  $('#acknowledge').prop('checked', false);
  hideErrorMessage();
}