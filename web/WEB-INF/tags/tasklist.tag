<%@ include file="../jsp/inc/_taglibs.jsp"%>

<%@tag description="Task list"%>

<%@attribute type="fi.hut.soberit.agilefant.model.BacklogItem"
	name="backlogItem"%>
<%@attribute name="divId"%>
<%@attribute name="contextViewName"%>
<%@attribute name="contextObjectId"%>
<%@attribute name="hourReport"%>
<div>
<aef:currentUser />
<ul class="tasklist" id="${divId}" style="display:none;">
	<ww:form action="quickStoreTaskList" validate="false" onsubmit="return validateSpentEffortById('effortSpent_${backlogItem.id}','Invalid format for spent effort.'); return false;">
	<li class="tasklistItem">
Effort estimate
<br />
	<ww:hidden name="backlogItemId" value="${backlogItem.id}" />
	<ww:hidden name="contextViewName" value="${contextViewName}" />
	<ww:hidden name="contextObjectId" value="${contextObjectId}" />
	<c:choose>
		<c:when test="${backlogItem.state.name != 'DONE'}">
			<ww:textfield size="5" name="effortLeft"
				value="${backlogItem.effortLeft}" id="effortBli_${backlogItem.id}" />	
		</c:when>
		<c:otherwise>
			<ww:textfield size="5" name="effortLeft"
				value="${backlogItem.effortLeft}" id="effortBli_${backlogItem.id}"
				disabled="true" />
		</c:otherwise>
	</c:choose>
	<ww:select name="state" value="#attr.backlogItem.state.name"
		list="@fi.hut.soberit.agilefant.model.State@values()" listKey="name"
		listValue="getText('backlogItem.state.' + name())"
		onchange="change_effort_enabled(this.value, ${backlogItem.id})"/>
	<c:if test="${hourReport == 'true'}">
	<br />
		Log effort for <c:out value="${currentUser.initials}"/> 
		<%-- buggish calendar!
        <ww:url id="hourentryLink" action="createHourEntry" includeParams="none">
			<ww:param name="backlogItemId" value="${backlogItem.id}" />
			<ww:param name="iterationId" value="${iterationId}" />
			<ww:param name="autoclose" value="1" />
		</ww:url>
		 (<ww:a cssClass="openModalWindow" href="%{hourentryLink}&contextViewName=${contextViewName}&contextObjectId=${contextObjectId}">change</ww:a>)	
		--%>
		<br />
		<ww:textfield size="5" name="spentEffort" id="effortSpent_${backlogItem.id}"/>  
	</c:if>
	<hr />
	
	<script type="text/javascript">
	function change_effort_enabled(value, bliId) {
		if (value == "DONE") {
			document.getElementById("effortBli_" + bliId).disabled = true;
		}
		else {
			document.getElementById("effortBli_" + bliId).disabled = false;
		}
	}
	</script>

	</li>
	<c:forEach items="${backlogItem.tasks}" var="task">
		<ww:url id="editLink" action="editTask" includeParams="none">
			<ww:param name="taskId" value="${task.id}" />
		</ww:url>

		<li class="tasklistItem">

		<ww:a
			href="%{editLink}&contextViewName=${contextViewName}&contextObjectId=${contextObjectId}"
			title="${task.name}">
							${aef:subString(task.name, 40)}
							</ww:a>
		<br />

		<ww:select name="taskStates[${task.id}]" value="#attr.task.state.name"
			list="@fi.hut.soberit.agilefant.model.State@values()" listKey="name"
			listValue="getText('task.state.' + name())" />

		</li>
	</c:forEach>
	<ww:url id="createLink" action="createTask" includeParams="none">
		<ww:param name="backlogItemId" value="${backlogItem.id}" />
	</ww:url>
	<ww:a href="%{createLink}&contextViewName=${contextViewName}&contextObjectId=${contextObjectId}">New task &raquo;</ww:a>
	<hr />

	<ww:submit value="Store" action="quickStoreTaskList"/>

</ww:form>

</ul>
</div>