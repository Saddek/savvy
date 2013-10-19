<?php
	/*
	 * Used to enable cross-domain AJAX calls.
	 * Example: cross-domain.php?url=http://www.example.org/file.xml
	 */
	 
	$url = $_REQUEST["url"];
	
	if (substr ($url, 0, 7) != "http://"
		&& substr ($url, 0, 8) != "https://"
		&& substr ($url, 0, 6) != "ftp://") {
		// NB: only absolute URLs are allowed -
		// otherwise the script could be used to access local-to-file system files
		die("ERROR: The argument 'url' must be an absolute URL beginning with 'http://', 'https://', or 'ftp://'.");
	} else {
		// temporarily override CURLs user agent with the user's own
	    ini_set("user_agent", $_SERVER['HTTP_USER_AGENT']);
		// get the contents of the external URL and echo it
		echo file_get_contents($url);
	}
?>