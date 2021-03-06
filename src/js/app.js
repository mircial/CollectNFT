App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $.getJSON('../items.json', function(data) {
      var itemsRow = $('#itemsRow');
      var itemTemplate = $('#itemTemplate');
      $('#apply').attr('disabled', true);

      for (i = 0; i < data.length; i ++) {
        itemTemplate.find('.panel-title').text(data[i].Affiliation);
        itemTemplate.find('img').attr('src', data[i].picture_false);
        // itemTemplate.find('.affiliation').text(data[i].Affiliation);
        itemTemplate.find('.tokenId').text("--");
        itemTemplate.find('.classification').text(data[i].classification);
        itemTemplate.find('.state').text("--");
        // itemTemplate.find('.btn-apply').attr('data-id', data[i].id);
        itemsRow.append(itemTemplate.html());
      }
    });
    return await App.initWeb3();
  },
  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('CollectNFT.json', function(data) {
      App.contracts.CollectNFT = TruffleContract(data);
      // Set the provider for our contract
      App.contracts.CollectNFT.setProvider(App.web3Provider);  
    });   
    return App.bindEvents();
  },

  bindEvents: function() {
    $('#connect').on('click',App.handleConnectWallet);
    $('#apply').on('click', App.handleApplyNFT);
  },

  handleConnectWallet: async function(event) {

      event.preventDefault();
      var CollectNFTInstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[0];
        account = account.substr(0, 6) + '...'+ account.substr(38, 42);
        $('#connect').text(account);
        
        App.contracts.CollectNFT.deployed().then(function(instance) {
          CollectNFTInstance = instance;
          return CollectNFTInstance.totalItems();
        }).then(function(result){
          return  App.render();
        }).catch(function(err) {
          console.log(err.message);
        });
        });
      },

  handleApplyNFT: async function(event) {
      event.preventDefault();

      var TokenId = 0;
      var CoreAddress = '0xF94378A02Fb259890AF12095bf38E80E429286d5'
      var CollectNFTInstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[0];
        
        App.contracts.CollectNFT.deployed().then(function(instance) {
          CollectNFTInstance = instance;        
          return CollectNFTInstance.ApplyNFT(CoreAddress, TokenId, {from: account});  
        }).then(function(state){
          if(state) 
            return App.updateApplyState();
        }).catch(function(err) {
          console.log(err.message);
        });
        });
      },

  render: function() {
    $.getJSON('../items.json', function(data) {
      var itemsRow = $('#itemsRow');
      var itemsRowRender = $('#itemsRowRender');
      var itemTemplate = $('#itemTemplate');
      $('#apply').attr('disabled', false);
      itemsRow.hide();

      for (i = 0; i < data.length; i ++) {
        itemTemplate.find('.panel-title').text(data[i].Affiliation);
        itemTemplate.find('img').attr('src', data[i].picture_true);
        // itemTemplate.find('.affiliation').text(data[i].Affiliation);
        itemTemplate.find('.tokenId').text(data[i].tokenId);
        itemTemplate.find('.classification').text(data[i].classification);
        itemTemplate.find('.state').text("Possessed!");
        // itemTemplate.find('.btn-apply').attr('data-id', data[i].id);
        itemsRowRender.append(itemTemplate.html());
      }
    });
  },
      
  updateApplyState: function() {
    $('#apply').text('Success').attr('disabled', true);
  },
  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
