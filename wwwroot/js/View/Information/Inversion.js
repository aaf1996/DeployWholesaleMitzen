ns('Mitosiz.Site.Information.Inversion')
Mitosiz.Site.Information.Inversion.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetLogin();
    };
    base.Parameters = {
        storeId: 0,
    };
    base.Control = {
        divInvestmentSummary: function () { return $('#divInvestmentSummary'); },
        lblInvestment: function () { return $('#lblInvestment'); },
        lblTotalAmount: function () { return $('#lblTotalAmount'); },
        lblAvailableBalance: function () { return $('#lblAvailableBalance'); },
        lblStockBalance: function () { return $('#lblStockBalance'); },
        lblPurchasePendingBalance: function () { return $('#lblPurchasePendingBalance'); },
        lblLastUpdate: function () { return $('#lblLastUpdate'); },
        lblAmounts: function () { return $('#divInvestmentSummary .inv-value'); },
    };
    base.Event = {
        AjaxGetLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.storeId = data.data.storeId;
                    base.Function.GetInvestmentCalculation();
                }
                else {
                    base.Function.ShowError();
                }
            }
        },
        AjaxGetInvestmentCalculationSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Function.ShowInvestmentCalculation(data.data);
                }
                else {
                    base.Function.ShowError();
                }
            }
        },
        AjaxError: function () {
            base.Function.ShowError();
        },
    };
    base.Ajax = {
        AjaxGetLogin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Information.Actions.GetLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetLoginSuccess,
            onError: base.Event.AjaxError
        }),
        AjaxGetInvestmentCalculation: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Information.Actions.GetInvestmentCalculation,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetInvestmentCalculationSuccess,
            onError: base.Event.AjaxError
        }),
    };
    base.Function = {
        GetLogin: function () {
            base.Ajax.AjaxGetLogin.submit();
        },
        GetInvestmentCalculation: function () {
            base.Ajax.AjaxGetInvestmentCalculation.data = {
                storeId: base.Parameters.storeId
            };
            base.Ajax.AjaxGetInvestmentCalculation.submit();
        },
        ShowInvestmentCalculation: function (investment) {
            investment = investment || {};
            base.Control.lblInvestment().text(base.Function.FormatAmount(investment.investment));
            base.Control.lblTotalAmount().text(base.Function.FormatAmount(investment.totalAmount));
            base.Control.lblAvailableBalance().text(base.Function.FormatAmount(investment.availableBalance));
            base.Control.lblStockBalance().text(base.Function.FormatAmount(investment.stockBalance));
            base.Control.lblPurchasePendingBalance().text(base.Function.FormatAmount(investment.purchasePendingBalance));
            base.Control.lblLastUpdate().text('Actualizado a las ' + base.Function.FormatTime(new Date()));
            base.Function.StopLoading();
        },
        ShowError: function () {
            base.Control.lblAmounts().text('S/ --');
            base.Control.lblLastUpdate().text('');
            base.Function.StopLoading();
            Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
        },
        StopLoading: function () {
            base.Control.lblAmounts().removeClass('inv-skeleton');
            base.Control.divInvestmentSummary().attr('aria-busy', 'false');
        },
        FormatAmount: function (value) {
            var amount = parseFloat(value);
            if (isNaN(amount)) {
                amount = 0;
            }
            return 'S/ ' + amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        FormatTime: function (date) {
            return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
        },
    };
}
