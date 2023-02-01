

$(document).ready(function () {
    $("#datatable-buttons").DataTable({ lengthChange: !1, buttons: ["copy", "excel", "pdf", "colvis"] }).buttons().container().appendTo("#datatable-buttons_wrapper .col-md-6:eq(0)"), $(".dataTables_length select").addClass("form-select form-select-sm")
});
function setDT(users) {
    if (window.dtTable == undefined) {
        window.dtTable = $("#dttable").DataTable({
            data: users,
            columns: [
                { 'name': 'id', 'data': 'id' },
                { 'name': 'first_name', 'data': 'firstname' },
                { 'name': 'last_name', 'data': 'lastname' },
                { 'name': 'role', 'data': 'role',render(data){
                    if(data==1){
                        return '<span  class="badge rounded-pill badge-soft-success font-size-12" >Admin</span>'
                    }
                    if(role==2){
                       return ' <span  class="badge rounded-pill badge-soft-danger font-size-12" >user</span>'
                    }
                    if(role==3){
                         return '<span  class="badge rounded-pill badge-soft-warning font-size-12" >In Progress</span>'
                    }
                }},
                { 'name': 'status', 'data': 'status' ,render(status){
                    if(status==2){
                     return '<span  class="badge rounded-pill badge-soft-success font-size-12" >Active</span> '
                    };
                    if(status==1){ 
                     return '<span  class="badge rounded-pill badge-soft-warning font-size-12" >Inactive</span>'
                    }
                    if(status==3){
                        return '<span  class="badge rounded-pill badge-soft-danger font-size-12" >In progress</span> '
                    }
                }
                 },
                {
                    'name': 'Actions', 'data': 'id', render(id) {
                        
                        return '<button   onclick="alertFunction('+id+')"  type="button" class="btn btn-danger "  style="margin-right:10px ;" >  delete</button>';
                    }
                },
            ]
        });
        return 0;
    }
    window.dtTable.clear();
    window.dtTable.rows.add(users).draw();
    
}

     function alertFunction(id) {
            alert("Hello World "+id);
            deleteUse1r(id)
        }
   