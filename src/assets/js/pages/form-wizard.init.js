function setP(){
    $("#formapplication").steps({ headerTag: "h3", bodyTag: "section", transitionEffect: "slide" ,onFinished: function (event, currentIndex) {
        $(".sub-btn").trigger('click');
      }});
}
