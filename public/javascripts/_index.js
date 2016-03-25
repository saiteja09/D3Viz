function checkcred()
{
    var msg = document.getElementsByClassName('invalid')[0].value;
    if(msg == "Invalid Credentials")
    {

        sweetAlert("Oops...", "Invalid Credentials!", "error");
    }
}