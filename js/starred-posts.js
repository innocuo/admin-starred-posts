( function( $ ){
  var stars_ids = [];
  var star_queue = {};

  function ino_set_star( label, post_id, star_id, steps){

    if( stars_ids.length <= 0 ) return;

    var new_idx, new_star_id, tmp_idx;

    var $link = $('a.ino-star-postid-' + post_id);

    var idx = $.inArray( star_id, stars_ids); //position of star in main list

    if(idx >= 0){ //if star was found

      tmp_idx = ( idx + steps ) % ( stars_ids.length + 1 );
      new_idx = ( tmp_idx >= stars_ids.length )? -1 : tmp_idx;

    }else if( star_id === "0"){ //"0" is the disabled star

      tmp_idx = ( -1 + steps ) % ( stars_ids.length + 1 );
      new_idx = ( tmp_idx >= stars_ids.length )? -1 : tmp_idx;

    }else{

      new_idx = -1;

    }

    new_star_id = ( new_idx >= 0 )? stars_ids[ new_idx ] : 0;

    //remove star class, so we can add the new one
    //it's done in a loop because there should be 2 stars per post (one is hidden for mobile)
    $link.each(function(idx, el){
      el.className = el.className.replace(/\bc\d+?\b/g, '');
    })

    $link
      .attr('title', label)
      .addClass( 'c' + new_star_id );

    if( steps == 0){

      $link.data( 'star_id', new_star_id );
    }

  }


  $( function(){

    //check if there's a stars column
    var $header = $('.ino-starred-column-header');
    if( $header.length > 0 ){
      //header holds the list of available ids
      var ids = $header.data('stars_ids');

      if( ids.length > 0){

        stars_ids = ids.split(',');
      }
    }

    //make stars clickable
    $( '.ino-star-clickable' ).click( function( e ){

      e.preventDefault();

      var $link = $( this ),
          post_id = $link.data( 'post_id' ),
          star_id = $link.data( 'star_id' ) + ''; //star id should be a string

      var queue_id = 'post_' + post_id;

      //add to queue if there's one otherwise create a queue
      if( star_queue[ queue_id ] ){

        //make sure there are available stars to be set
        if( stars_ids.length > 0 ){
          star_queue[ queue_id ].post.abort(); //always abort current request to avoid double update
          star_queue[ queue_id ].steps++; //steps will let us know what star to set
        }else{
          return;
        }

      }else{

        star_queue[ queue_id ] = {
          steps: 1,
          post: null
        };
      }

      //local update
      ino_set_star( '', post_id, star_id,  star_queue[ queue_id ].steps );

      $link.css('opacity', 0.55);

      //network update
      star_queue[ queue_id ].post = $.post(
        ajaxurl,
        {
          'action'   : 'ino_set_star',
          'post_id': post_id,
          'steps': star_queue[ queue_id ].steps,
          'star_id': star_id
        },
        function( result ){

          star_queue[ queue_id ] = null;

          if( typeof result.val !== 'undefined' ){
            stars_ids = result.ids;
            var result_label = ( result.label )? 'starred with \'' + result.label + '\'' : '';
            var new_star_id = (result.val == 0)? -1 : result.val;
            ino_set_star( result_label, post_id, new_star_id,  0 );
          }

          $link.css('opacity', 0.99);;
        },
        'json'
      );
    } );
  } );
} )( jQuery );
