<%@ Page Language="C#"%>
<html>
<head>
<title>Hello World!</title>
</head>
<body>
<% for (int i=1; i <7; i++) 
{ %>
	<font size="   <%=i%>"> C# inside aspx! </font> <br>
<%   }
Response.Write("<p><cite>COOL</cite></p>");
%>
</body>
</html>
