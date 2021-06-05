import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

const app = createApp({
  //資料
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/api',  //api 網址
      apiPath: 'hungmarty-api',
      products: [],
      isNew: false,    // 新增還是update
      tempProduct: {   // 暫存資料
        imagesUrl: [],
      },
    }
  }, 
  //生命週期
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (token === '') {
      alert('您尚未登入請重新登入。');
      window.location = 'login.html';
    }
    //將 token 放進 header(每次發出請求設定預設值) 
    axios.defaults.headers.common.Authorization = token;
    //取資料 (資料列表)
    this.getData();
  },
  //方法
  methods: {
    //取得資料
    getData(page = 1) {
      const url = `${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url).then((response) => {
        if (response.data.success) {
          this.products = response.data.products;
        } else {
          alert(response.data.message);
        }
      })
      .catch( (error)=>{
        alert('資料錯誤');
      })
    },
    //新增更新商品資料
    updateProduct() {
      let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
      let http = 'post';
      //更新
      if(!this.isNew) {
        url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url,  { data: this.tempProduct }).then((response) => {
        if(response.data.success) {
          alert(response.data.message);
          productModal.hide();
          this.getData();
        } else {
          alert(response.data.message);
        }
      })
      .catch( (error)=>{
        alert('資料錯誤');
      })
    },
    //Bootstrap Modal.show()方法
    openModal(isNew, item) {
      if(isNew === 'new') {   // 新增
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if(isNew === 'edit') {
        this.tempProduct = { ...item }; // 淺copy
        this.isNew = false;
        productModal.show(); //修改
      } else if(isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()  //刪除
      }
    },
    delProduct() {
      const url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          delProductModal.hide();
          this.getData();
        } else {
          alert(response.data.message);
        }
      }).
      catch( (error)=>{
        alert('錯誤');
      });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
});

app.mount('#app');
