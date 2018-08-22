<h1>XSS Test Playground</h1>

Use the GET parameter to play with different contexts:<br>
'a': normal php echo<br>
'aa': htmlspecialchars() echo

<br>
<br>
<br>
<b><a href="?a=xss">$_GET['a']</a> | <a href="?aa=xss">$_GET['aa']</a> - HTML Context</b>:<br>
a:<br>
aa:<br>
<br>
<br>
<b><a href="?b=xss">$_GET['b']</a> | <a href="?bb=xss">$_GET['bb']</a> - HTML Attribut Context</b> in quotes:<br>
b: <img src=""> <br>
bb: <img src=""> <br>
bbb: <img src=''>
<br>
<br>
<br>
<b><a href="?c=xss">$_GET['c']</a> | <a href="?cc=xss">$_GET['cc']</a> - HTML Attribut Context</b> no quotes: <br>
c: <img src=><br>
cc: <img src=><br>
<br>
<br>
<b><a href="?d=xss">$_GET['d']</a> | <a href="?dd=xss">$_GET['dd']</a> - Script Context</b>:<br>
d: <script></script> <br>
dd: <script></script>
<br>
<br>
<br>
<hr>
<h3>Chrome XSS Auditor Trick</h3>
<br>
<b>Trick 1</b> - remove all occurrences of "script":<br>
e:<br>
<br>
Thats all je lah for now<br>
