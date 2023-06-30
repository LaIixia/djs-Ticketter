client.on("interactionCreate", async (interaction) => {
  if (interaction.customId === "create") {
    await interaction.reply({
      content: "作成しました",
      ephemeral: true,
    });
    const name = "チケット" + "-" + `${interaction.user.id}`;
    if (interaction.guild.channels.cache.find((tic) => tic.name === `${name}`))
      return await interaction.reply({
        content: `既に作成済です\nhttps://discord.com/channels/${
          interaction.guild.id
        }/${
          interaction.guild.channels.cache.find((tic) => tic.name === `${name}`)
            .id
        }`,
        ephemeral: true,
      });
    await interaction.guild.channels
      .create(`${name}`, {
        reason: `Created By : ${interaction.user.username}`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: interaction.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
          {
            id: client.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
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
    const embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription(
        "チケットを作成しました。削除する場合は下のボタンを押してください"
      );
        const del = new Discord.MessageButton()
      .setCustomId("delete")
      .setStyle("DANGER")
      .setLabel("削除");
    await interaction.guild.channels.cache
      .find((ch) => ch.name === `${name}`)
      .send({
        embeds: [embed],
        components: [new Discord.MessageActionRow().addComponents(del)],
      });
  }
  if (interaction.customId === "delete") {
    const cid = interaction.channel.id;
    await interaction.channels.delete(`${cid}`).catch(async (error) => {
      await interaction.reply({
        content:
          "このコマンドを使うにはボットに以下の権限が必要です。\n```チャンネルの管理```",
        ephemeral: true,
      });
    });
  }
});
