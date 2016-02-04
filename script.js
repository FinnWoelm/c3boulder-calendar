$(function() {
  var url = "https://www.hylo.com/noo/community/c3boulder/posts?filter=future&limit=10&sort=start_time&type=event";
  $.ajax(url)
    .success(function(data) {
      var posts = data['posts'];

      $.each(posts, function (){
        var dt = this['start_time'];
        createEvent(this['id'], this['name'], this['start_time'], this['end_time'], this['location'], this['description'], this['user'], this['media'].length > 0 ? this['media'][0]['url'] : this['communities'][0]['avatar_url']);
      });
    })
    .fail(function(msg) {
      console.log('Failed to load events: ' + msg);
    });


  function createEvent(id, name, startDate, endDate, location, description, user, imageUrl) {
    var container = $("#container");
    var eventTemplate = $("#event-template div.event");

    // create new event from empty template
    var event = eventTemplate.clone();

    // add data
    event.find(".image-holder div.event-image").css('background-image', 'url('+imageUrl+')');
    event.find(".name").html(name);
    event.find(".description").html(description.replace(/<.{0,1}p>/, ""));
    event.find(".description").text(cut(200));
    event.find(".description").append(" ...");
    event.find(".start-date").html(formatDate(startDate));
    event.find(".duration").html(formatDuration(startDate, endDate));
    //event.find(".end-date").html(formatDate(endDate));
    event.find(".date-overlay .day").html(getDay(startDate));
    event.find(".date-overlay .month").html(getMonth(startDate));
    event.find(".location").html(location);
    event.find(".event-link").attr("href", "https://www.hylo.com/p/"+id)

    // append event to page
    container.append(event);
  }

  // cuts a text at whitespace. From http://stackoverflow.com/questions/10751102/cut-a-string-after-n-characters-but-if-its-in-the-middle-of-a-word-cut-the-who
  function cut(n) {
      return function textCutter(i, text) {
          var short = text.substr(0, n);
          if (/^\S/.test(text.substr(n)))
              return short.replace(/\s+\S*$/, "");
          return short;
      };
  }

  function formatDuration(start, end) {
    start = new Date(start);
    end = new Date(end);
    duration = end.getTime() - start.getTime();
    console.log(duration);
    formattedDuration = "";

    MINUTE = 1000*60;
    HOUR = MINUTE*60;
    DAY = HOUR*24;

    days = Math.floor(duration / DAY );
    hours = Math.floor( (duration % DAY) / HOUR);
    minutes = Math.floor( ((duration % DAY) % HOUR) / MINUTE);

    if (days > 0)
      formattedDuration = days + " " + (days > 1 ? "days" : "day") + " ";
    if (hours > 0)
      formattedDuration = hours + " " + (hours > 1 ? "hours" : "hour") + " ";
    if (minutes > 0)
      formattedDuration = minutes + " " + (minutes > 1 ? "minutes" : "minute") + " ";

    return formattedDuration.trim();            
  } 

  function formatDate(date) {
    DAYS = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
    MONTHS = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    date = new Date(date);

    console.log(new Date(getNextWeek(Date.now()-timezone())+timezone()).toUTCString());
    console.log(date.toUTCString());
    console.log(date);
    //console.log()

    // if in the same week, just show name of day + time
    // Saturday at 4PM
    if (date.getTime() < getNextWeek(Date.now()-timezone())+timezone() ){
      return "on " + DAYS[date.getDay()] + " at " + formatTime(date);
    }
    else {
      return "on " + DAYS[date.getDay()] + ", " + MONTHS[date.getMonth()] + " " + date.getDate() + " at " + formatTime(date);
    }
  }

  function timezone () {
    return (new Date().getTimezoneOffset()) * 1000*60;
  } 

  function formatTime(date) {
    date = new Date(date);

    hour = date.getHours() % 12;
    if (hour == 0)
      hour = 12;

    mode = (date.getHours() < 12 ? "AM" : "PM");

    return hour + mode;
  }

  /*function formatDate(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    var offsetMtn = 420;
    startDate.setMinutes(startDate.getMinutes() - offsetMtn);
    endDate.setMinutes(endDate.getMinutes() - offsetMtn);
    var dt = startDate.toLocaleString() + " - ";

    console.log(getNextWeek(Date.now()));

    // if in the same week, just show name of day + time
    if (startDate.getMilliseconds() < getNextWeek(Date.now())) {
      dt += "lol";
    }
    // Start and end date is the same for the event
    else if (startDate.getDate() == endDate.getDate() && startDate.getMonth() == endDate.getMonth()) {
      dt += endDate.toLocaleTimeString();
    }
    else {
      dt += endDate.toLocaleString();
    }
    return dt;
  }*/

  function getNextWeek(date) {
    FULL_DAY = 1000*60*60*24;
    return date - (date % FULL_DAY) - ((new Date(date).getDay() + 1) * FULL_DAY) + (7 * FULL_DAY);
  }

  function getDayOfWeek(date) {

  }

  function getDay(date) {
     date = new Date(date);
     var offsetMtn = 420;
     date.setMinutes(date.getMinutes() - offsetMtn);
     return date.getDate();
   }

  function getMonth(date) {
     var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");    
     date = new Date(date);
     var offsetMtn = 420;
     date.setMinutes(date.getMinutes() - offsetMtn);                
     return months[date.getMonth()];
   }
});

