<?php include 'includes/head.php'; ?>
<?php include 'includes/nav.php'; ?>

<div class="row">
    <div class="span3">
        <h3>Red Rectangle</h3>
        Type:
        <div class="btn-group">
            <button class="btn" onclick="setType(redRect,'center')">center</button>
            <button class="btn" onclick="setType(redRect,'inner')">inner</button>
            <button class="btn" onclick="setType(redRect,'outer')">outer</button>
        </div>
        <br>
        X:
        <div class="btn-group">
            <button class="btn" onclick="setX(redRect,'center')">center</button>
            <button class="btn" onclick="setX(redRect,'left')">left</button>
            <button class="btn" onclick="setX(redRect,'right')">right</button>
        </div>
        <br>
        Y:
        <div class="btn-group">
            <button class="btn" onclick="setY(redRect,'center')">center</button>
            <button class="btn" onclick="setY(redRect,'top')">top</button>
            <button class="btn" onclick="setY(redRect,'bottom')">bottom</button>
        </div>
    </div>
    <div class="span3">
        <h3>Blue Rectangle</h3>
        Type:
        <div class="btn-group">
            <button class="btn" onclick="setType(blueRect,'center')">center</button>
            <button class="btn" onclick="setType(blueRect,'inner')">inner</button>
            <button class="btn" onclick="setType(blueRect,'outer')">outer</button>
        </div>
        <br>
        X:
        <div class="btn-group">
            <button class="btn" onclick="setX(blueRect,'center')">center</button>
            <button class="btn" onclick="setX(blueRect,'left')">left</button>
            <button class="btn" onclick="setX(blueRect,'right')">right</button>
        </div>
        <br>
        Y:
        <div class="btn-group">
            <button class="btn" onclick="setY(blueRect,'center')">center</button>
            <button class="btn" onclick="setY(blueRect,'top')">top</button>
            <button class="btn" onclick="setY(blueRect,'bottom')">bottom</button>
        </div>
    </div>
    <div class="span3">
        <h3>Green Rectangle</h3>
        Type:
        <div class="btn-group">
            <button class="btn" onclick="setType(greenRect,'center')">center</button>
            <button class="btn" onclick="setType(greenRect,'inner')">inner</button>
            <button class="btn" onclick="setType(greenRect,'outer')">outer</button>
        </div>
        <br>
        X:
        <div class="btn-group">
            <button class="btn" onclick="setX(greenRect,'center')">center</button>
            <button class="btn" onclick="setX(greenRect,'left')">left</button>
            <button class="btn" onclick="setX(greenRect,'right')">right</button>
        </div>
        <br>
        Y:
        <div class="btn-group">
            <button class="btn" onclick="setY(greenRect,'center')">center</button>
            <button class="btn" onclick="setY(greenRect,'top')">top</button>
            <button class="btn" onclick="setY(greenRect,'bottom')">bottom</button>
        </div>
    </div>
</div>
<canvas id="stage" width="800" height="500"></canvas>

<script src="js/grafix.nocache.js"></script>
<script>

    Grafix.import();
    
    function setX( rect, x ) {
        
        rect.alignData.x = x;
        rect.align = rect.alignData.align;
    }
    
    function setY( rect, y ) {
        
        rect.alignData.y = y;
        rect.align = rect.alignData.align;
    }
    
    function setType( rect, type ) {
        
        rect.alignData.type = type;
        rect.align = rect.alignData.align;
    }

    var stage = new Stage( '#stage' );
    stage.color = Color.black;
    
    var redRect = new Rectangle( { width: 400, height: 400, color: 'red' } ),
        blueRect = new Rectangle( { width: 250, height: 250, color: 'blue' } ),
        greenRect = new Rectangle( { width: 100, height: 100, color: 'green' } );
        
    redRect.alignData = {
        x: 'left',
        y: 'top',
        type: 'inner',
        get align() {
            
            return [ this.x, this.y, this.type ].join( ' ' );
        }
    };
    
    blueRect.alignData = {
        x: 'left',
        y: 'top',
        type: 'inner',
        get align() {
            
            return [ this.x, this.y, this.type ].join( ' ' );
        }
    };
    
    greenRect.alignData = {
        x: 'left',
        y: 'top',
        type: 'inner',
        get align() {
            
            return [ this.x, this.y, this.type ].join( ' ' );
        }
    };

    stage.addChild( redRect.addChild( blueRect.addChild( greenRect ) ) );
    
    redRect.align = redRect.alignData.align;
    blueRect.align = blueRect.alignData.align;
    greenRect.align = greenRect.alignData.align;
    
    stage.start( true );

</script>
<?php include 'includes/foot.php'; ?>
