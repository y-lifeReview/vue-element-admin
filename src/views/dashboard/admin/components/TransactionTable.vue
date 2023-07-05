<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="id" min-width="80">
      <template slot-scope="scope">
        {{ scope.row.id  }}
      </template>
    </el-table-column>
    <el-table-column label="ip地址" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.ip }}
      </template>
    </el-table-column>
    <el-table-column label="所属城市" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.city }}
      </template>
    </el-table-column>
    <el-table-column label="最后访问时间" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.updata_at | timeFormat(scope.row.updata_at)}}
      </template>
    </el-table-column>
    <el-table-column label="总访问次数" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status ">
          {{ row.times }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    timeFormat(str) {
      let time = new Date(str)
      return time.toLocaleDateString() +' '+ time.toLocaleTimeString()
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then(response => {
        
        this.list = response.data
      })
    }
  }
}
</script>
