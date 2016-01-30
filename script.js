$(function() {
  var url = "https://www.hylo.com/noo/community/c3boulder/posts?filter=future&limit=10&sort=start_time&type=event";
  $.ajax(url)
    .success(function(data) {
      var posts = data['posts'];

      $.each(posts, function (){
        var dt = this['start_time'];
        createEvent(this['id'], this['name'], this['start_time'], this['end_time'], this['location'], this['description'], this['user'], this['communities'][0]['avatar_url']);
      });
    })
    .fail(function(msg) {
      console.log('Failed to load events: ' + msg);
    });


  function createEvent(id, name, startDate, endDate, location, description, user, imageUrl) {
    var container = $("#container");
    var eventTemplate = $("#event-template div");

    // create new event from empty template
    var event = eventTemplate.clone();

    // add data
    event.find(".image").attr('src', imageUrl);
    event.find(".name").html(name);
    // event.find(".description").html(description);
    event.find(".date").html(formatDate(startDate, endDate));
    event.find(".location").html(location);

    // append event to page
    container.append(event);
  }

  function formatDate(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    var offsetMtn = 420;
    startDate.setMinutes(startDate.getMinutes() - offsetMtn);
    endDate.setMinutes(endDate.getMinutes() - offsetMtn);
    var dt = startDate.toLocaleString() + " - ";
    // Start and end date is the same for the event
    if (startDate.getDate() == endDate.getDate() && startDate.getMonth() == endDate.getMonth()) {
      dt += endDate.toLocaleTimeString();
    }
    else {
      dt += endDate.toLocaleString();
    }
    return dt;
  }
});
