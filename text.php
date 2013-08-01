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
        <h3>Text</h3>
        Text: <textarea onchange="text.string=this.value"></textarea>
        Text Align:
        <div class="btn-group">
            <button class="btn" onclick="setTextAlign(text,'center')">center</button>
            <button class="btn" onclick="setTextAlign(text,'left')">left</button>
            <button class="btn" onclick="setTextAlign(text,'right')">right</button>
        </div>
        <br>
        Type:
        <div class="btn-group">
            <button class="btn" onclick="setType(text,'center')">center</button>
            <button class="btn" onclick="setType(text,'inner')">inner</button>
            <button class="btn" onclick="setType(text,'outer')">outer</button>
        </div>
        <br>
        X:
        <div class="btn-group">
            <button class="btn" onclick="setX(text,'center')">center</button>
            <button class="btn" onclick="setX(text,'left')">left</button>
            <button class="btn" onclick="setX(text,'right')">right</button>
        </div>
        <br>
        Y:
        <div class="btn-group">
            <button class="btn" onclick="setY(text,'center')">center</button>
            <button class="btn" onclick="setY(text,'top')">top</button>
            <button class="btn" onclick="setY(text,'bottom')">bottom</button>
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
    
    function setTextAlign( text, align ) {
        
        text.textAlign = align;
    }

    var stage = new Stage( '#stage' );
    stage.color = Color.black;
    
    var redRect = new Rectangle( { width: 400, height: 400, color: 'red' } ),
        blueRect = new Rectangle( { width: 250, height: 250, color: 'blue' } ),
        text = new Text( { 
            string: "Test\nand also\nmultiline! :)",
            textAlign: 'center',
            color: 'white',
            width: blueRect.width
        } );
        
    redRect.alignData = {
        x: 'center',
        y: 'center',
        type: 'center',
        get align() {
            
            return [ this.x, this.y, this.type ].join( ' ' );
        }
    };
    
    blueRect.alignData = {
        x: 'center',
        y: 'center',
        type: 'center',
        get align() {
            
            return [ this.x, this.y, this.type ].join( ' ' );
        }
    };
    
    text.alignData = {
        x: 'center',
        y: 'center',
        type: 'center',
        get align() {
            
            return [ this.x, this.y, this.type ].join( ' ' );
        }
    };

    stage.addChild( redRect.addChild( blueRect.addChild( text ) ) );
    
    redRect.align = redRect.alignData.align;
    blueRect.align = blueRect.alignData.align;
    text.align = text.alignData.align;
    
    stage.start( true );

</script>
<?php include 'includes/foot.php'; ?>
