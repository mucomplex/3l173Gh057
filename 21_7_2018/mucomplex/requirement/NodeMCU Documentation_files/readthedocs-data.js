var READTHEDOCS_DATA = {
    "programming_language": "c", 
    "docroot": "/home/docs/checkouts/readthedocs.org/user_builds/nodemcu/checkouts/master/docs", 
    "source_suffix": ".md", 
    "api_host": "https://readthedocs.org", 
    "language": "en", 
    "builder": "mkdocs", 
    "project": "nodemcu", 
    "theme": "readthedocs", 
    "version": "master", 
    "commit": "67027c0d05f7e8d1b97104e05a3715f6ebc8d07f", 
    "page": null
}

// Old variables
var doc_version = "master";
var doc_slug = "nodemcu";
var page_name = "None";
var html_theme = "readthedocs";

READTHEDOCS_DATA["page"] = mkdocs_page_input_path.substr(
    0, mkdocs_page_input_path.lastIndexOf(READTHEDOCS_DATA.source_suffix));
