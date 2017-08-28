module.exports = {
    execute: async function (helper, data) {
        await helper.gotoSection('a.list-group-item[key="section_l"]');
        await helper.clickOn('button.btn.btn-green.noprint');

        
        await helper.setSelectIndex('#SpeciesFK', 1);

        
        await helper.type('#Method', 'For small animals: CO2 Inhalation followed by physical method. For large animals: Injectable agents following sedation.');
        await helper.type('#Description', 'For small animals: the flow of CO2 into the euthanasia chamber should be at a rate to displace 20% of the chamber volume per minute over at least 5 minutes, followed by cervical dislocation or decapitation. For large animals: Intracardiac overdose of saturated Sodium Pentobarbital.');
        await helper.type('#Carcass', 'The carcass is placed in double biohazard bag and stored in minus 20°C freezer (if required) for eventual collection by SembCorp for incineration.');
        await helper.clickOn('#btnAddOrEditMethod');
        
        
        await helper.type('#Form_SL2', 'How will death be verified or assured - test');

        await helper.screenshot("SectionL.png");
    }
}