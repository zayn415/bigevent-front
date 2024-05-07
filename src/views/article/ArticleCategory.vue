<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {categoryListService, categoryAddService, categoryUpdateService, categoryDeleteService} from "@/api/category.js";
import {ElMessage, ElMessageBox} from "element-plus";

const categorys = ref('')

// 获取文章分类列表
const categoryList = async () => {
  const res = await categoryListService()
  categorys.value = res.data
}
categoryList();

// 表单验证规则
const rules = {
  categoryName: [
    {required: true, message: '请输入分类名称', trigger: 'blur'},
    {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
  ]
}

// 添加分类
const addData = ref({
  id: '',
  categoryName: '',
})
const addDialog = ref(false); // 控制弹窗显示隐藏
const addCategory = async () => {
  const res = await categoryAddService(addData.value);
  ElMessage.success(res.msg ? res.msg : '添加成功');

  // 关闭弹窗并刷新
  addDialog.value = false;
  await categoryList();
}

// 编辑分类
const editDialog = ref(false); // 控制弹窗显示隐藏
const editData = ref({
  id: '',
  categoryName: ''
}); // 编辑分类数据
const newName = ref(''); // 编辑分类名称
const openEdit = (row) => {
  editDialog.value = true;

  editData.value.id = row.id;
  editData.value.categoryName = row.categoryName;
}
const editCategory = async () => {
  editData.value.categoryName = newName.value;
  const res = categoryUpdateService(editData.value);
  ElMessage.success(res.msg ? res.msg : '修改成功')
  // 关闭弹窗并刷新
  editDialog.value = false;
  await categoryList();
}

// 删除分类
const delCategory = (row) => {
  ElMessageBox.confirm('是否删除该分类?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await categoryDeleteService(row.id);
    ElMessage.success(res.msg ? res.msg : '删除成功');
    await categoryList();
  }).catch(() => {
    ElMessage.info('已取消删除')
  });
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <el-button type="primary"
            @click="addDialog = true">
            添加分类
          </el-button>
        </div>
      </div>
    </template>
    <el-table :data="categorys" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="openEdit(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="delCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="addDialog" title='添加分类' width="30%" @close="addData.categoryName=''">
      <el-form :model="addData" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="addData.categoryName" minlength="1" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="addDialog = false; addData.categoryName=''">取消</el-button>
            <el-button type="primary" @click="addCategory"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>

    <!--    编辑分类弹窗-->
    <el-dialog v-model="editDialog" title='编辑分类' width="30%" @close=" newName=''">
      <el-form :model="editData" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input :placeholder="editData.categoryName" v-model="newName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="editDialog=false; newName=''">取消</el-button>
            <el-button type="primary" @click="editCategory"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>