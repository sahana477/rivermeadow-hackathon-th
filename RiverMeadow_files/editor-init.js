document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('textarea.editor')) {
        tinymce.init({
            selector: 'textarea.editor',
            height: 500,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount',
                'emoticons', 'template', 'paste', 'textcolor', 'hr',
                'contextmenu', 'textpattern', 'quickbars', 'codesample',
                'directionality', 'visualchars', 'nonbreaking', 'pagebreak',
                'toc', 'imagetools', 'autoresize', 'markdown', 'print',
                'importcss', 'searchreplace', 'wordcount', 'visualblocks',
                'visualchars', 'template', 'codesample', 'fontsize', 'forecolor',
                'backcolor', 'emoticons', 'charmap', 'insertdatetime'
            ],
            
            // Enhanced toolbars with all features
            toolbar1: 'formatselect | fontselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent',
            toolbar2: 'undo redo | cut copy paste | searchreplace | bullist numlist | link image media table | charmap emoticons hr | print preview | fullscreen code',
            toolbar3: 'h1 h2 h3 h4 h5 h6 | blockquote codesample | subscript superscript | removeformat | help',
            
            // Enable menu bar with all options
            menubar: 'file edit view insert format tools table help',
            menu: {
                file: { title: 'File', items: 'newdocument restoredraft | preview | print' },
                edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                view: { title: 'View', items: 'code | visualaid visualchars visualblocks | preview fullscreen' },
                insert: { title: 'Insert', items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime' },
                format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | styles blocks fontsize align lineheight | removeformat' },
                tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
                table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' }
            },
            
            // Font options
            font_formats: 'Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n',
            fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
            
            // Advanced options
            image_advtab: true,
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            
            // Image upload handler
            images_upload_handler: function (blobInfo, success, failure, progress) {
                const formData = new FormData();
                formData.append('image', blobInfo.blob(), blobInfo.filename());
                
                // Get CSRF token if you're using it
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                
                fetch('/upload-image', {
                    method: 'POST',
                    headers: csrfToken ? {
                        'X-CSRF-Token': csrfToken
                    } : {},
                    body: formData
                })
                .then(response => {
                    if (!response.ok) throw new Error('Upload failed');
                    return response.json();
                })
                .then(result => {
                    if (result.error) {
                        failure(result.error);
                    } else {
                        success(result.location);
                    }
                })
                .catch(error => {
                    failure(`Image upload failed: ${error.message}`);
                });
            },

            // Content styling
            content_style: `
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    line-height: 1.4;
                    margin: 1rem;
                    max-width: 100%;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-weight: bold;
                    margin: 0.75em 0;
                }
                h1 { font-size: 2.5em; }
                h2 { font-size: 2em; }
                h3 { font-size: 1.75em; }
                h4 { font-size: 1.5em; }
                h5 { font-size: 1.25em; }
                h6 { font-size: 1em; }
                pre { background-color: #f5f5f5; padding: 1em; border-radius: 4px; }
                code { background-color: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; }
                blockquote { border-left: 4px solid #ddd; margin: 1em 0; padding-left: 1em; }
                table { border-collapse: collapse; width: 100%; }
                table td, table th { border: 1px solid #ddd; padding: 8px; }
            `,
            
            // Additional settings for better user experience
            browser_spellcheck: true,
            contextmenu: "link image table configurepermanentpen",
            paste_data_images: true,
            relative_urls: false,
            remove_script_host: false,
            convert_urls: true,
            element_format: 'html',
            entity_encoding: 'raw',
            keep_styles: true,
            protect: [
                /\<\/?(if|endif)\>/g,  // Protect conditional comments
                /\<\!--[\s\S]*?--\>/g  // Protect comments
            ]
        });
    }
});