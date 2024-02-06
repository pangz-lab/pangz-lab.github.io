

function FaqManager() {
    return {
        initList: (parentContainer) => {
            var faqFormattedList = '';
            index = 1;
            faqs.forEach(item => {
                item
                faqFormattedList += faqTemplate.replaceAll("PH_ACCORDION_INDEX", index)
                .replaceAll("PH_ITEM_NUM", '[ ' + index + ' ] ')
                .replaceAll("PH_FAQ_Q", item.q)
                .replaceAll("PH_FAQ_A", item.a);
                index++;
            });
            parentContainer.html(faqFormattedList);
        }
    }    
}