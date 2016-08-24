declare class JXON {

    /**
     * Overrides default configuration properties
     * Defaults:
     *    valueKey: '_',
     *    attrKey: '$',
     *    attrPrefix: '$',
     *    lowerCaseTags: false,
     *    trueIsEmpty: false,
     *    autoDate: false,
     *    ignorePrefixedNodes: false,
     *    parseValues: false,
     *    parserErrorHandler: undefined
     */
    static config(cfg:any) : void;
    
    /**
     * Converts XML string to JS object.
     *  xmlString - XML string to convert to JXON notation JS object
     */
    static stringToJs(xmlString : string) : any;

    /**
     * Converts JS object to XML string.
     *  obj - JS object in JXON notation to convert to XML string
     */
    static jsToString(obj : any) : string;

    /**
     * Converts XML document to JS object.
     *  xmlDocument - The XML document to be converted into JavaScript Object.
     *  verbosity - Optional verbosity level of conversion, from 0 to 3. It is almost equivalent to our algorithms from #4 to #1 (default value is 1, which is equivalent to the algorithm #3).
     *  freeze - Optional boolean expressing whether the created object must be freezed or not (default value is false).
     *  nestedAttributes - Optional boolean expressing whether the the nodeAttributes must be nested into a child-object named keyAttributes or not (default value is false for verbosity levels from 0 to 2; true for verbosity level 3).
     * Example:
     *     var myObject = JXON.xmlToJs(xmlDoc);
     */    
    static xmlToJs(xmlDocument:XMLDocument, verbosity:number, freeze:boolean, nestedAttributes:boolean) : any;

    /**
     * Converts JS object to XML document.
     *  obj - The JavaScript Object from which you want to create your XML Document.
     *  namespaceURI - Optional DOMString containing the namespace URI of the document to be created, or null if the document doesn't belong to one.
     *  qualifiedNameStr - Optional DOMString containing the qualified name, that is an optional prefix and colon plus the local root element name, of the document to be created.
     *  documentType - Optional DocumentType of the document to be created. It defaults to null.
     * Example:
     * var myObject = JXON.jsToXml(myObject);
     */    
    static jsToXml(obj:any, namespaceURI:string, qualifiedNameStr:string, documentType:number) : any;

    /**
     * Wrapper over DOMParser.parseFromString, converts string to XML document.
     *  xmlString - XML string to convert to XML document
     */
    static stringToXml(xmlString : string) : XMLDocument;

    /**
     * Wrapper over XMLSerializer.serializeToString, converts XML document to string.
     *  xmlObj - XML document to convert to XML string
     */
    static xmlToString(xmlObj:XMLDocument) : string;

    /**
     * Helper method to iterate node(s).
     * In case that there is only one children node, JXON will return object. For multiple children it will return array. This method will always iterate nodes as array.
     *  obj - array or object to iterate
     *  callback - function to execute for each element
     *  thisArg - optional. Value to use as this when eecuting callback
     * Example:
     *  var jx = jxon.stringToJs('<val>foo</val>');
     *  jxon.each(jx.val, function(val) {
     *      assert(val, 'foo');
     *  });
     */
    static each(obj:any, callback:any, thisArg:any) : void;
}
