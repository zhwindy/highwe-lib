(function() {
  Vue.directive('loading', function(value, target) {
    if (!this.vm.$data.loading_target) {
      target = 'body';
    } else {
      target = this.vm.$data.loading_target;
    }
    if (!!value) {
      $(target).append('<div class="highwe-loading"><svg class="part l" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50px" height="50px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g><path fill="#040000" d="M52.451,10.494c18.441-4.941,37.352,4.69,44.514,21.834C87.965,8.55,62.229-5.001,37.149,1.72C10.582,8.838-5.246,36.02,1.59,62.594c0.992,4.299,3.463,7.563,6.977,8.516c6.066,1.646,12.934-4.208,15.339-13.074c0.766-2.823,0.985-5.609,0.735-8.152C23.207,32.102,34.602,15.277,52.451,10.494z"/></g></svg><svg version="1.1" class="part r" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="50px" height="50px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g><path fill="#040000" d="M99.602,42.209c2.33,18.401-9.225,36.157-27.643,41.092c-8.741,2.343-17.588,1.407-25.239-2.047l0.002,0.003l-0.002,0.002c-2.618-1.305-6.136-1.844-9.871-1.297c-7.2,1.055-12.474,5.741-11.782,10.465c0.378,2.579,2.456,4.634,5.435,5.8L30.5,96.228c9.947,4.241,21.332,5.312,32.587,2.295C88.134,91.812,103.639,67.266,99.602,42.209z"/></g></svg></div>');
    } else {
      $(target).find('.highwe-loading').remove();
    }
  });

  Vue.directive('bird-loading', function(value, target) {
    if (!this.vm.$data.loading_target) {
      target = 'body';
    } else {
      target = this.vm.$data.loading_target;
    }
    if (!!value) {
      $(target).append('<div class="highwe-loading"><svg class="part l" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50px" height="50px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g><path fill="#834676" d="M52.451,10.494c18.441-4.941,37.352,4.69,44.514,21.834C87.965,8.55,62.229-5.001,37.149,1.72C10.582,8.838-5.246,36.02,1.59,62.594c0.992,4.299,3.463,7.563,6.977,8.516c6.066,1.646,12.934-4.208,15.339-13.074c0.766-2.823,0.985-5.609,0.735-8.152C23.207,32.102,34.602,15.277,52.451,10.494z"/></g></svg><svg version="1.1" class="part r" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="50px" height="50px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g><path fill="#834676" d="M99.602,42.209c2.33,18.401-9.225,36.157-27.643,41.092c-8.741,2.343-17.588,1.407-25.239-2.047l0.002,0.003l-0.002,0.002c-2.618-1.305-6.136-1.844-9.871-1.297c-7.2,1.055-12.474,5.741-11.782,10.465c0.378,2.579,2.456,4.634,5.435,5.8L30.5,96.228c9.947,4.241,21.332,5.312,32.587,2.295C88.134,91.812,103.639,67.266,99.602,42.209z"/></g></svg></div>');
    } else {
      $(target).find('.highwe-loading').remove();
    }
  });

}).call(this);
