using DinkToPdf;
using DinkToPdf.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Utilities
{
    public class ConvertHtmlToPdf
    {
        private readonly IConverter _converter;
        public ConvertHtmlToPdf(IConverter converter)
        {
            _converter = converter;
        }
        public byte[] CreatePDF(string Name, string template, bool windowsize = false)
        {
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                PaperSize = PaperKind.Letter,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = Name,
            };

          globalSettings.Orientation = (windowsize == false) ? Orientation.Portrait : Orientation.Landscape;

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                HtmlContent = template,
                WebSettings = { DefaultEncoding = "utf-8", EnableIntelligentShrinking = false },
                //HeaderSettings = { FontSize = 9, Right = "Page [page] of [toPage]", Line = true, Spacing = 2.812 }
            };
            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };
            var file = _converter.Convert(pdf);
            return file;
        }
    }
}
