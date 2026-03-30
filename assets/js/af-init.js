// AppsFlyer OneLink Smart Script - Initialization & Link Replacement
(function() {
    var oneLinkURL = "https://luminaclean.onelink.me/mKbo";
    var webReferrer = "af_channel";
    var mediaSource = {keys: ["utm_source"], defaultValue: "Website"};
    var campaign = {keys: ["utm_campaign"]};
    var adSet = {keys: ["utm_medium"]};
    var ad = {keys: ["utm_content"]};
    var custom_ss_ui = {paramKey: "af_ss_ui", defaultValue: "true"};

    var result = window.AF_SMART_SCRIPT.generateOneLinkURL({
        oneLinkURL: oneLinkURL,
        webReferrer: webReferrer,
        afParameters: {
            mediaSource: mediaSource,
            campaign: campaign,
            adSet: adSet,
            ad: ad,
            afCustom: [custom_ss_ui]
        }
    });

    if (result && result.clickURL) {
        // Replace all LuminaClean App Store links (not competitor links, not JSON-LD)
        document.querySelectorAll('a[href*="apps.apple.com"][href*="id6757949814"]').forEach(function(link) {
            // Skip links inside JSON-LD script tags (they won't be found by querySelectorAll anyway)
            link.href = result.clickURL;
        });
    }
})();
