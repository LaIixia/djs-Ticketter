//ボタン表示
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  if (!interaction.member.permissions.has("ADMINISTRATOR"))
    return interaction.reply({
      content: "このコマンドを使うには以下の権限が必要です。\n```管理者権限```",
      ephemeral: true,
    });
  if (interaction.commandName === "ticket") {
    const add = new Discord.MessageButton()
      .setCustomId("create")
      .setStyle("PRIMARY")
      .setLabel("チケットを作成する");
    const embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription("チケットを作成するには下のボタンを押してください");
    await interaction.reply({
      embeds: [embed],
      components: [new Discord.MessageActionRow().addComponents(add)],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
//チケットを作成
  if (interaction.customId === "create") {
    const del = new Discord.MessageButton()
      .setCustomId("delete")
      .setStyle("DANGER")
      .setLabel("削除");
    const embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription(
        "チケットを作成しました。削除する場合は下のボタンを押してください"
      );
    const name = interaction.user.tag;
    const mid = Math.floor(Math.random() * 1000);
    await interaction.guild.channels
      .create(`${name}` + "-" + `${mid}`, {
        reason: `Created By : ${interaction.user.username}`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: interaction.user.id,
            allow: ["VIEW_CHANNEL","SEND_MESSAGES"],
          },
        ],
      })
      .catch(async (error) => {
        await interaction.reply({
          content:
            "このコマンドを使うにはボットに以下の権限が必要です。\n```チャンネルの管理```",
          ephemeral: true,
        });
      });
    await interaction.guild.channels.cache
      .find((ch) => ch.name === `${name}` + "-" + `${mid}`)
      .send({
        embeds: [embed],
        components: [new Discord.MessageActionRow().addComponents(del)],
      });
  }
//チケットを削除
  if (interaction.customId === "delete") {
    const cid = interaction.channel.id;
    await interaction.guild.channels
      .delete(`${cid}`, { reason: `Deleted By : ${interaction.user.username}` })
      .catch(async (error) => {
        await interaction.reply({
          content:
            "このコマンドを使うにはボットに以下の権限が必要です。\n```チャンネルの管理```",
          ephemeral: true,
        });
      });
  }
});
