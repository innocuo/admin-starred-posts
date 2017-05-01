( function( $ ){
  var stars_ids = [];
  var star_queue = {};

  function ino_set_star( link, label, post_id, star_id, steps){

    if( stars_ids.length <= 0 ) return;

    var idx = $.inArray( star_id, stars_ids);
    var new_idx, new_star_id, tmp_idx;

    if(idx >= 0){

      tmp_idx = ( idx + steps ) % ( stars_ids.length + 1 );
      new_idx = ( tmp_idx >= stars_ids.length )? -1 : tmp_idx;

    }else if( star_id == 0){

      tmp_idx = ( -1 + steps ) % ( stars_ids.length + 1 );
      new_idx = ( tmp_idx >= stars_ids.length )? -1 : tmp_idx;

    }else{

      new_idx = 0;

    }

    new_star_id = ( new_idx >= 0 )? stars_ids[ new_idx ] : 0;

    link
      .attr('title', label)
      .attr( 'class', 'ino-star c' + new_star_id );

    if( steps == 0){
      link.data( 'star_id', new_star_id );
    }

  }


  $( function(){

    $( '.ino-star-clickable' ).click( function( e ){

      e.preventDefault();
      var $link = $( this ),
          post_id = $link.data( 'post_id' ),
          star_id = $link.data( 'star_id' );

      $link.css('opacity', 0.7);

      var queue_id = 'post_' + post_id;

      if( star_queue[ queue_id ] ){

        star_queue[ queue_id ].post.abort();
        star_queue[ queue_id ].steps++;
      }else{

        star_queue[ queue_id ] = {
          steps: 1,
          post: null
        };
      }

      ino_set_star( $link, '', post_id, star_id,  star_queue[ queue_id ].steps );

      star_queue[ queue_id ].post = $.post(
        ajaxurl,
        {
          'action'   : 'ino_set_star',
          'post_id': post_id
        },
        function( result ){

          star_queue[ queue_id ] = null;

          if( typeof result.val !== 'undefined' ){
            stars_ids = result.ids;

            $link.attr( 'class', 'ino-star c'+result.val )
              .data('star_id', result.val);

            if( result.label ){
              $link.attr( 'title', 'starred with \'' + result.label + '\'' )
            }else{
              $link.attr( 'title', '');
            }
          }

          $link.css('opacity', 0.99);;
        },
        'json'
      );
    } );
  } );
} )( jQuery );
